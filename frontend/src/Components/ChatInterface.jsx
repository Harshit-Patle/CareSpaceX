import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const ChatInterface = ({ recipient, initialMessages = {}, onSendMessage }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            id: messages.length + 1,
            text: newMessage,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages([...messages, message]);
        onSendMessage?.(message);
        setNewMessage('');
    };

    const isCurrentUser = (sender) => sender === 'user';

    return (
        <div className="flex flex-col h-[88vh] max-h-screen pt-4 md:pt-0">
            {/* Chat Header */}
            <div className="border-b border-purple-200 p-2 sm:p-4 flex items-center bg-purple-50">
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <img
                        src={recipient?.avatar || "/api/placeholder/100/100"}
                        alt={recipient?.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                    />
                    <div>
                        <h3 className="font-medium text-[#563393] text-sm sm:text-base">{recipient?.name}</h3>
                        <p className="text-xs sm:text-sm text-purple-500">
                            {recipient?.role === 'doctor' ? recipient?.specialty : 'Patient'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 bg-purple-50/30">
                {messages.map((message) => {
                    const isUser = isCurrentUser(message.sender);
                    return (
                        <div
                            key={message.id}
                            className={`flex items-end space-x-1 sm:space-x-2 ${isUser ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            {/* Avatar for recipient messages */}
                            {!isUser && (
                                <img
                                    src={recipient?.avatar || "/api/placeholder/32/32"}
                                    alt=""
                                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                                />
                            )}

                            <div
                                className={`max-w-[80%] sm:max-w-[70%] p-2 sm:p-3 rounded-lg text-sm sm:text-base ${isUser
                                    ? 'bg-[#563393] text-white rounded-br-none'
                                    : 'bg-white border border-purple-200 rounded-bl-none'
                                    }`}
                            >
                                <div className="break-words">
                                    {message.text}
                                </div>
                                <div
                                    className={`text-[10px] sm:text-xs mt-1 ${isUser ? 'text-purple-200' : 'text-purple-400'
                                        }`}
                                >
                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>

                            {/* Avatar for user messages */}
                            {isUser && (
                                <img
                                    src="/api/placeholder/32/32"
                                    alt=""
                                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                                />
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="border-t border-purple-200 p-2 sm:p-4 bg-white">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 text-sm sm:text-base border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#563393] placeholder-purple-300"
                    />
                    <button
                        type="submit"
                        className="p-2 bg-[#563393] text-white rounded-lg hover:bg-purple-700 transition-colors flex-shrink-0"
                        aria-label="Send message"
                    >
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;