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

const backendURL = import.meta.env.VITE_BACKEND_URL;

const InventoryManagement = () => {
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const email = Cookies.get('email');
                const response = await axios.post(
                    `${backendURL}/add/collect`,
                    { email },
                    { headers: { "Content-Type": "application/json" } }
                );
                if (response.data && response.data.items) {
                    setInventories(response.data.items);
                } else {
                    setError("No inventory items found");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch inventory");
            } finally {
                setLoading(false);
            }
        };
        fetchInventories();
    }, []);

    const [newInventory, setNewInventory] = useState({
        type: '',
        name: '',
        quantity: '',
        email: Cookies.get('email'),
    });

    const inventoryTypes = ['Medicine', 'Blood', 'Medical Equipment'];

    const handleAddInventory = async () => {
        if (!newInventory.type || !newInventory.name || !newInventory.quantity) {
            return;
        }
        try {
            const response = await axios.post(
                `${backendURL}/add/inventory`,
                newInventory,
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.status === 200) {
                setInventories([...inventories, { ...newInventory, id: Date.now() }]);
                setNewInventory({ type: '', name: '', quantity: '', email: Cookies.get('email') });
            } else {
                alert("Failed to add new inventory");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to add new inventory");
        }
    };

    const handleDeleteInventory = async (id) => {
        try {
            await axios.delete(`${backendURL}/delete/inventory/${id}`);
            setInventories(inventories.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting inventory:", error);
        }
    };

    if (loading) return <div className="loading">Loading inventory...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="p-2 w-full">
            <Card className="border-[#563393]/20">
                <CardHeader className="border-b border-[#563393]/10">
                    <CardTitle className="text-[#563393] text-3xl font-bold">Inventory Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <Label htmlFor="type" className="text-[#563393]">Type</Label>
                            <Select
                                value={newInventory.type}
                                onValueChange={(value) => setNewInventory(prev => ({ ...prev, type: value }))}
                            >
                                <SelectTrigger className="border-[#563393]/20 focus:ring-[#563393]/20">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {inventoryTypes.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="name" className="text-[#563393]">Name</Label>
                            <Input
                                id="name"
                                value={newInventory.name}
                                onChange={(e) => setNewInventory(prev => ({ ...prev, name: e.target.value }))}
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
                                onChange={(e) => setNewInventory(prev => ({ ...prev, quantity: e.target.value }))}
                                placeholder="Enter quantity"
                                min="0"
                                className="border-[#563393]/20 focus:ring-[#563393]/20"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button onClick={handleAddInventory} className="w-full bg-[#563393] hover:bg-[#563393]/90 text-white">
                                <PlusCircle className="w-4 h-4 mr-2" /> Add Item
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
                            {inventories.map((item) => (
                                <TableRow key={item.id} className="border-[#563393]/10">
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteInventory(item.id)} className="hover:bg-[#563393]/10">
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default InventoryManagement;
