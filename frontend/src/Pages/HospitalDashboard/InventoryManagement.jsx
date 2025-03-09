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

// IMPORTANT: Update these endpoint paths to match your actual backend API
const backendURL = import.meta.env.VITE_BACKEND_URL || 'https://carespacex-backend.onrender.com';
const COLLECT_ENDPOINT = '/inventory/collect'; // Changed from /add/collect
const ADD_ENDPOINT = '/inventory/add';         // Changed from /add/inventory
const DELETE_ENDPOINT = '/inventory/delete';   // Changed from /delete/inventory

const InventoryManagement = () => {
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newInventory, setNewInventory] = useState({
        type: '',
        name: '',
        quantity: '',
    });

    const fetchInventory = async () => {
        try {
            setLoading(true);
            setError(null);

            const email = Cookies.get('email');
            if (!email) {
                setError("User not logged in. Please log in first.");
                setLoading(false);
                return;
            }

            console.log("Fetching inventory with email:", email);
            console.log("Using endpoint:", `${backendURL}${COLLECT_ENDPOINT}`);

            const response = await axios({
                method: 'post',
                url: `${backendURL}${COLLECT_ENDPOINT}`,
                data: { email },
                headers: { "Content-Type": "application/json" }
            });

            console.log("API Response:", response);

            // Handle different possible response structures
            if (response.data && response.data.items) {
                setInventories(response.data.items);
            } else if (response.data && Array.isArray(response.data)) {
                setInventories(response.data);
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                setInventories(response.data.data);
            } else {
                console.warn("Unexpected API response format:", response.data);
                setInventories([]);
            }
        } catch (err) {
            console.error("Error fetching inventory:", err);

            // More descriptive error message
            let errorMsg = "Failed to load inventory: ";
            if (err.response) {
                // Server responded with error
                errorMsg += `Server returned ${err.response.status} - ${err.response.statusText || 'Unknown error'}`;
                if (err.response.status === 404) {
                    errorMsg += " (Endpoint not found - please check API routes)";
                }
            } else if (err.request) {
                // Request made but no response
                errorMsg += "No response from server. Please check if the backend is running.";
            } else {
                // Request setup error
                errorMsg += err.message || "Unknown error";
            }

            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const inventoryTypes = [
        'Medicine',
        'Blood',
        'Medical Equipment'
    ];

    const handleAddInventory = async () => {
        // Validation
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
            setLoading(true);
            console.log("Adding inventory using endpoint:", `${backendURL}${ADD_ENDPOINT}`);

            const response = await axios({
                method: 'post',
                url: `${backendURL}${ADD_ENDPOINT}`,
                data: {
                    // Try different data formats that your API might expect
                    email,
                    newInventory: {
                        ...newInventory,
                        email
                    },
                    // Alternative format some APIs might use
                    type: newInventory.type,
                    name: newInventory.name,
                    quantity: newInventory.quantity,
                },
                headers: { "Content-Type": "application/json" }
            });

            console.log("Add response:", response);

            if (response.status >= 200 && response.status < 300) {
                // Reset form
                setNewInventory({ type: '', name: '', quantity: '' });
                // Refresh inventory
                fetchInventory();
            } else {
                alert("Failed to add inventory item: " + (response.data?.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error adding inventory:", error);
            let errorMsg = "Failed to add item: ";

            if (error.response) {
                if (error.response.status === 404) {
                    errorMsg += "Endpoint not found. Please check API routes.";
                } else {
                    errorMsg += error.response.data?.message || `Error ${error.response.status}`;
                }
            } else {
                errorMsg += error.message || "Unknown error";
            }

            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteInventory = async (itemId) => {
        if (!itemId) {
            console.error("No item ID provided for deletion");
            return;
        }

        const email = Cookies.get('email');
        if (!email) {
            alert("Session expired. Please log in again.");
            return;
        }

        try {
            setLoading(true);
            console.log("Deleting item using endpoint:", `${backendURL}${DELETE_ENDPOINT}`);

            const response = await axios({
                method: 'post',
                url: `${backendURL}${DELETE_ENDPOINT}`,
                data: {
                    id: itemId,
                    email,
                    // Alternative format some APIs might use
                    itemId,
                    userEmail: email
                },
                headers: { "Content-Type": "application/json" }
            });

            console.log("Delete response:", response);

            if (response.status >= 200 && response.status < 300) {
                // Temporary update UI immediately for better UX
                setInventories(prev => prev.filter(item => (item._id || item.id) !== itemId));
                // Refresh inventory to ensure sync with server
                fetchInventory();
            } else {
                alert("Failed to delete item: " + (response.data?.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error deleting inventory:", error);
            let errorMsg = "Failed to delete item: ";

            if (error.response) {
                if (error.response.status === 404) {
                    errorMsg += "Endpoint not found. Please check API routes.";
                } else {
                    errorMsg += error.response.data?.message || `Error ${error.response.status}`;
                }
            } else {
                errorMsg += error.message || "Unknown error";
            }

            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

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
                                onValueChange={(value) => setNewInventory({ ...newInventory, type: value })}
                                disabled={loading}
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
                                disabled={loading}
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
                                min="1"
                                className="border-[#563393]/20 focus:ring-[#563393]/20"
                                disabled={loading}
                            />
                        </div>

                        <div className="flex items-end">
                            <Button
                                onClick={handleAddInventory}
                                className="w-full bg-[#563393] hover:bg-[#563393]/90 text-white"
                                disabled={loading}
                            >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add Item
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
                            <p className="font-medium">Error:</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center p-6">
                            <div className="animate-pulse text-[#563393]">Loading inventory...</div>
                        </div>
                    ) : (
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
                                {inventories && inventories.length > 0 ? (
                                    inventories.map((item) => (
                                        <TableRow key={item._id || item.id} className="border-[#563393]/10">
                                            <TableCell>{item.type}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteInventory(item._id || item.id)}
                                                    className="hover:bg-[#563393]/10"
                                                    disabled={loading}
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default InventoryManagement;