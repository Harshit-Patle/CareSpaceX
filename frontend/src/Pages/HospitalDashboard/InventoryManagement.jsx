import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { PlusCircle, Trash2 } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';

const InventoryManagement = () => {
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const fetchInventory = async () => {
        try {
            const email = Cookies.get('email');
            if (!email) {
                setError("User not logged in");
                setLoading(false);
                return;
            }

            const response = await axios.post(
                `${backendURL}/add/collect`,
                { email },
                { headers: { "Content-Type": "application/json" } }
            );

            let items = [];

            if (response && response.data) {
                if (Array.isArray(response.data.items)) {
                    items = response.data.items;
                } else if (Array.isArray(response.data)) {
                    items = response.data;
                }
            }

            setInventories(items);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching inventory:", err);
            setError("Failed to fetch inventory items");
            setInventories([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const [newInventory, setNewInventory] = useState({
        type: '',
        name: '',
        quantity: '',
    });

    const inventoryTypes = ['Medicine', 'Blood', 'Medical Equipment'];

    const handleAddInventory = async () => {
        if (!newInventory.type || !newInventory.name || !newInventory.quantity) {
            alert("Please fill in all fields");
            return;
        }

        const email = Cookies.get('email');
        if (!email) {
            alert("User email not found. Please log in again.");
            return;
        }

        try {
            const response = await axios.post(
                `${backendURL}/add/inventory`,
                {
                    newInventory: {
                        ...newInventory,
                        email,
                    },
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                fetchInventory(); // Refresh the inventory list after adding
                setNewInventory({ type: '', name: '', quantity: '' }); // Reset form
            } else {
                alert("Failed to add new inventory item");
            }
        } catch (error) {
            console.error("Error adding inventory:", error);
            alert("Failed to add new inventory item");
        }
    };

    const handleDeleteInventory = async (id) => {
        const email = Cookies.get('email');
        if (!email) {
            alert("User email not found. Please log in again.");
            return;
        }

        try {
            const response = await axios.post(
                `${backendURL}/delete/inventory`,
                {
                    id,
                    email,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.status === 200) {
                fetchInventory(); // Refresh inventory after deletion
            } else {
                alert("Failed to delete inventory item");
            }
        } catch (error) {
            console.error("Error deleting inventory:", error);
            alert("Failed to delete inventory item");
        }
    };

    if (loading) return <div className="p-4 text-center">Loading inventory...</div>;

    return (
        <div className="p-2 w-full">
            <Card className="border-[#563393]/20">
                <CardHeader className="border-b border-[#563393]/10">
                    <CardTitle className="text-[#563393] text-3xl font-bold">Inventory Management</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <Label htmlFor="type" className="text-[#563393]">Type</Label>
                            <Select
                                value={newInventory.type}
                                onValueChange={(value) => setNewInventory({ ...newInventory, type: value })}
                            >
                                <SelectTrigger className="border-[#563393]/20 focus:ring-[#563393]/20">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {inventoryTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="name" className="text-[#563393]">Name</Label>
                            <Input
                                id="name"
                                value={newInventory.name}
                                onChange={(e) => setNewInventory({ ...newInventory, name: e.target.value })}
                                placeholder="Enter item name"
                                className="border-[#563393]/20 focus:ring-[#563393]/20"
                            />
                        </div>

                        <div>
                            <Label htmlFor="quantity" className="text-[#563393]">Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                value={newInventory.quantity}
                                onChange={(e) => setNewInventory({ ...newInventory, quantity: e.target.value })}
                                placeholder="Enter quantity"
                                min="0"
                                className="border-[#563393]/20 focus:ring-[#563393]/20"
                            />
                        </div>

                        <div className="flex items-end">
                            <Button
                                onClick={handleAddInventory}
                                className="w-full bg-[#563393] hover:bg-[#563393]/90 text-white"
                            >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add Item
                            </Button>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="border-[#563393]/10">
                                <TableHead className="text-[#563393]">Type</TableHead>
                                <TableHead className="text-[#563393]">Name</TableHead>
                                <TableHead className="text-[#563393]">Quantity</TableHead>
                                <TableHead className="text-[#563393] w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventories.length > 0 ? (
                                inventories.map((item) => (
                                    <TableRow key={item._id || item.id || Math.random().toString()} className="border-[#563393]/10">
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteInventory(item._id || item.id)}
                                                className="hover:bg-[#563393]/10"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-[#563393]/60">
                                        No items in inventory
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default InventoryManagement;
