import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Menu, X } from 'lucide-react';
import ChatInterface from "@/Components/ChatInterface";
import axios from 'axios';
import Cookies from 'js-cookie';

const ChatWithPatient = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [patientChats, setpatientChats] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchHospitals = async () => {
            let recipient = Cookies.get('email')
            try {
                const response = await axios.post(
                    `${backendURL}/history/patient`,
                    { recipient },
                    { headers: { "Content-Type": "application/json" } }
                );
                console.log(response)
                const data = response.data;

                const uniqueRecipients = [...new Set(data.map(item => item.sender))]
                let res = await axios.post(`${backendURL}/history/patientlist`, { uniqueRecipients },
                    { headers: { "Content-Type": "application/json" } }
                );
                setpatientChats(res.data);
                console.log(res.data)
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch hospitals. Please try again later.");
                setLoading(false);
            }
        };
        fetchHospitals();
    }, []);


    if (loading) return <div>Loading hospitals...</div>;
    if (error) return <div>{error}</div>;




    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    };

    const handleChatSelection = async (chat) => {


        let recipient = chat.email
        let sender = Cookies.get('email')

        try {
            const response = await axios.post(
                `${backendURL}/history/chat`,
                { recipient, sender },
                { headers: { "Content-Type": "application/json" } }
            );
            setSelectedChat(response.data);
            setLoading(false);

            console.log(response.data);
        } catch (err) {
            setError("Failed to fetch hospitals. Please try again later.");
            setLoading(false);
        }


        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };


    return (
        <div className="relative flex h-[87vh] overflow-hidden p-1">
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden absolute top-4 right-4 z-50 p-2 text-purple-600 hover:bg-purple-100 rounded-lg"
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Patient Chats List - Sidebar */}
            <div className={`
                absolute lg:relative
                w-full lg:w-1/3 
                h-full
                bg-white
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                border-r border-purple-200 
                overflow-y-auto
                z-40 lg:z-auto
            `}>
                <div className="p-4 border-b border-purple-200 bg-purple-50">
                    <h2 className="text-xl font-semibold text-[#563393] ml-8 lg:ml-0">Patient Chats</h2>
                </div>
                <div className="space-y-2 p-4">
                    {patientChats.map((chat) => (
                        <Card
                            key={chat.id}
                            className={`cursor-pointer hover:shadow-md transition-shadow ${selectedChat?.id === chat.id ? 'ring-2 ring-[#563393]' : ''
                                }`}
                            onClick={() => handleChatSelection(chat)}

                        >
                            <CardContent className="p-4 hover:bg-purple-50">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={chat.avatar}
                                        alt={chat.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <h3 className="font-medium text-[#563393] truncate">{chat.name}</h3>
                                            <span className="text-sm text-purple-600 flex-shrink-0">{chat.timestamp}</span>
                                        </div>
                                        <p className="text-sm text-purple-500 truncate">{chat.lastMessage}</p>
                                    </div>
                                    {chat.unread && (
                                        <div className="w-3 h-3 bg-[#563393] rounded-full flex-shrink-0" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white overflow-hidden">
                {selectedChat ? (
                    <ChatInterface
                        recipient={selectedChat}
                        initialMessages={[
                            {
                                id: 1,
                                text: selectedChat.lastMessage,
                                sender: 'user',
                                timestamp: new Date().toISOString()
                            }
                        ]}
                        onSendMessage={(message) => {
                            console.log('Sending message:', message);
                            // Implement your message sending logic here
                        }}
                    />
                ) : (
                    <div className="h-full flex items-center justify-center text-purple-400">
                        <div className="text-center">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                            <p>Select a patient chat to start responding</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatWithPatient;