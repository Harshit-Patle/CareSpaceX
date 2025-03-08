import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, Hospital, Pill, Box, Map } from 'lucide-react';

const HomePage = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: "Hospital Bed Booking",
            description: "Book hospital beds in real-time across our network of partner hospitals",
            icon: <Hospital className="h-8 w-8 text-purple-600" />,
            route: "/signup"
        },
        {
            title: "Doctor Appointment Booking",
            description: "Schedule appointments with specialized healthcare professionals",
            icon: <Calendar className="h-8 w-8 text-purple-600" />,
            route: "/signup"
        },
        {
            title: "Hospital Inventory Management",
            description: "Efficiently manage and track hospital resources and equipment",
            icon: <Box className="h-8 w-8 text-purple-600" />,
            route: "/signup"
        },
        {
            title: "Nearby Hospital Inventories",
            description: "Find medical equipment and resources in hospitals near you",
            icon: <Map className="h-8 w-8 text-purple-600" />,
            route: "/signup"
        },
        {
            title: "Medicine Information",
            description: "Access detailed information about medications and their availability",
            icon: <Pill className="h-8 w-8 text-purple-600" />,
            route: "/signup"
        },
        {
            title: "AI Chat Support",
            description: "Get instant assistance with our AI-powered healthcare support system",
            icon: <MessageCircle className="h-8 w-8 text-purple-600" />,
            route: "/signup"
        }
    ];

    const handleGetStarted = () => {
        navigate('/signup');
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Welcome to CareSpaceX</h1>
                        <p className="text-xl mb-8">Your Complete Healthcare Management Solution</p>
                        <Button
                            className="bg-white text-purple-600 hover:bg-purple-50"
                            onClick={handleGetStarted}
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center mb-12 text-purple-800">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow duration-300 bg-white border-purple-100">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-purple-800">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                    <Button
                                        className="mt-4 bg-purple-600 text-white hover:bg-purple-700"
                                        onClick={() => navigate(feature.route)}
                                    >
                                        Learn More
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;