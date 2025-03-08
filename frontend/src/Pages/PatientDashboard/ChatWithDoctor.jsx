import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import ChatInterface from "@/Components/ChatInterface";
import io from 'socket.io-client';
import axios from 'axios';
import Cookies from 'js-cookie';

const socket = io('http://localhost:3000');

const ChatWithDoctor = () => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [messages, setMessages] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chat, setChat] = useState([]);
    const [chatStatus, setChatStatus] = useState(""); 

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const city = Cookies.get('city');
                const state = Cookies.get('state');
                const country = Cookies.get('country');
                const response = await axios.post(
                    "http://localhost:3000/loading/new",
                    { city, state, country },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                setDoctors(response.data.doctors);
                setLoading(false);
            } catch (err) {
                setError("Something went wrong!");
                setLoading(false);
            }
        };

        fetchDoctors();

        socket.on('message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setChatStatus(""); // Reset chat status when a message is received
        });

        socket.on('typing', (typingStatus) => {
            setChatStatus(typingStatus); // Set typing status when received from the server
        });

        return () => {
            socket.off('message');
            socket.off('typing');
        };
    }, []);

    const handleDoctorClick = async(doctor) => {
        setSelectedDoctor(doctor);
        const sender = Cookies.get('email');
        const recipient = doctor.email;

        const response = await axios.post(
            "http://localhost:3000/history/chat",
            { sender, recipient },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                //jhfvihfiu
            }
        );
        console.log(response.data);
        setChat(response.data);
        setMessages(chat);
    };

    const sendMessage = async(message) => {
        const newMessage = {
            text: message,
            timestamp: new Date().toISOString(),
        };

        const sender = Cookies.get('email');
        const recipient = selectedDoctor.email;

        const response = await axios.post(
            "http://localhost:3000/history/save",
            { sender, recipient, newMessage },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Emit message to server
        socket.emit('message', newMessage);
    };

    const handleTyping = () => {
        if (selectedDoctor) {
            socket.emit('typing', `${Cookies.get('email')} is typing...`);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex h-[87vh] overflow-hidden">
            {/* Doctors List */}
            <div className="w-1/3 border-r border-purple-200 overflow-y-scroll">
                <div className="p-4 border-b border-purple-200 bg-purple-50">
                    <h2 className="text-xl font-semibold text-[#563393]">Available Doctors</h2>
                </div>
                <div className="space-y-2 p-4">
                    {doctors.map((doctor) => (
                        <Card
                            key={doctor.id}
                            className={`cursor-pointer hover:shadow-md transition-shadow ${selectedDoctor?.id === doctor.id ? 'ring-2 ring-[#563393]' : ''}`}
                            onClick={() => handleDoctorClick(doctor)}
                        >
                            <CardContent className="p-4 hover:bg-purple-50">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={doctor.avatar}
                                        alt={doctor.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-[#563393]">{doctor.name}</h3>
                                        <p className="text-sm text-purple-500">{doctor.specialty}</p>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${doctor.status === 'online' ? 'bg-green-500' : 'bg-purple-200'}`} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white">
                {selectedDoctor ? (
                    <div>
                        <ChatInterface
                            recipient={selectedDoctor}
                            initialMessages={[{
                                text: `Hello! I'm ${selectedDoctor.name}. How can I help you today?`,
                                sender: 'doctor',
                                timestamp: new Date().toISOString(),
                            }, ...messages]}
                            onSendMessage={sendMessage}
                            onTyping={handleTyping} // Call the handleTyping when typing
                        />
                        {/* Render chat status if there is one */}
                        {chatStatus && (
                            <div className="text-purple-500 text-sm mt-2">{chatStatus}</div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-purple-400">
                        <div className="text-center">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                            <p>Select a doctor to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatWithDoctor;