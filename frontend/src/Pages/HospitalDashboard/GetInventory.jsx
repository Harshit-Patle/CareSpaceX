import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import axios from "axios";
import Cookies from 'js-cookie';
const backendURL = import.meta.env.VITE_BACKEND_URL;

const GetInventory = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [inventoryData, setinventoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.post(
                    `${backendURL}/medicine/available`,
                    {},
                    { headers: { "Content-Type": "application/json", }, }
                );
                setinventoryData(response.data);
                setLoading(false);
            } catch (err) {
                setError("Something went wrong!");
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const filteredInventory = inventoryData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-6 text-[#563393]">Get Medical Inventory</h1>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search for medical supplies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 border-[#563393] border-opacity-30 focus:ring-[#563393] focus:border-[#563393]"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#563393]" />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredInventory.map(item => (
                        <Card key={item._id} className="shadow-lg bg-white border border-[#563393] border-opacity-10">
                            <CardContent className="p-6">
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold text-[#563393] mb-2">
                                        {item.Hospital}
                                    </h2>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-[#563393] text-opacity-70">{`${item.city},{item.state},{item.country}`}</p>
                                        <p>
                                            <span className="text-[#563393] text-opacity-60">Phone: </span>
                                            <span className="text-[#563393] text-opacity-80">{item.phone}</span>
                                        </p>
                                        <p>
                                            <span className="text-[#563393] text-opacity-60">Email: </span>
                                            <span className="text-[#563393] text-opacity-80">{item.email}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[#563393] border-opacity-20">
                                    <div className="text-lg font-medium mb-2 text-[#563393] text-opacity-90">
                                        {item.itemName}
                                    </div>
                                    <div className="text-3xl font-bold text-[#563393]">
                                        {item.quantity.toLocaleString()}<span className='font-normal text-base'>quantity</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredInventory.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-[#563393] text-opacity-60">No inventory found for "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GetInventory;
