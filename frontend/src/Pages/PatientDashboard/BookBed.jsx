import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bed, FileText } from "lucide-react";
import axios from 'axios';
import Cookies from 'js-cookie';


const BookBedModal = ({
    isOpen,
    onClose,
    hospitalName,
    pricePerNight
}) => {
    const [formData, setFormData] = useState({
        patientName: "",
        reason: "",
        hospital: "",
        price: "",
        currency: "INR",
        email: "",

    });
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const loadRazorpayScripts = () => {
        return new Promise((resolve, reject) => {
            const razorpayScript = document.createElement('script');
            razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
            razorpayScript.onload = () => resolve(true);
            razorpayScript.onerror = () => reject('Failed to load Razorpay SDK.');
            document.body.appendChild(razorpayScript);

            const axiosScript = document.createElement('script');
            axiosScript.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
            document.body.appendChild(axiosScript);
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
          
 
           formData.price=Cookies.get('Charges');
           formData.hospital=Cookies.get('hospital');
           formData.email=Cookies.get('email');
        onClose();

        console.log(formData);

        try {
            const res = await loadRazorpayScripts();
            if (!res) {
                alert('Failed to load Razorpay SDK. Check your internet connection.');
                return;
            }

            const response = await axios.post(`${backendURL}/payment/create/orderId`, formData);
            const { amount, currency, id } = response.data;

            const options = {
                key: 'rzp_test_mPrfMJIy2Vcxb5',
                amount: amount,
                currency: currency,
                name: "CarespaceX",
                description: "Messenger of Health",
                order_id: id,
                handler: async function (response) {
                    try {
                        const verifyResponse = await axios.post(`${backendURL}/payment/api/payment/verify/bed`, {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            formData
                        });
                        alert('Payment verified successfully');
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: formData.patientName,
                    email: "ABC@gmail.com",
                    contact: "1111111111"
                },
                notes: {
                    address: "Razorpay Corporate Office"
                },
                theme: {
                    color: "#000099"
                }
            };

            const rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert('Payment Failed');
            });
            rzp1.open();

        } catch (error) {
            console.error('Error during payment creation:', error);
            alert('Error during payment creation. Please try again.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center text-[#563393]">
                        <Bed className="mr-2 text-[#7A51B3]" />
                        <span className="text-[#563393]">Book Hospital Bed</span>
                    </DialogTitle>
                    <DialogDescription className="text-[#7A51B3]">
                        Book a bed at {hospitalName} - ₹{pricePerNight}/night
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="patientName"
                            className="flex items-center mb-2 text-[#563393]"
                        >
                            <FileText size={16} className="mr-2 text-[#7A51B3]" />
                            <span>Patient Name</span>
                        </label>
                        <Input
                            id="patientName"
                            name="patientName"
                            value={formData.patientName}
                            onChange={handleInputChange}
                            placeholder="Enter patient's full name"
                            required
                            className="border-[#7A51B3] text-[#563393] focus:border-[#563393]"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="reason"
                            className="flex items-center mb-2 text-[#563393]"
                        >
                            <FileText size={16} className="mr-2 text-[#7A51B3]" />
                            <span>Reason for Admission</span>
                        </label>
                        <Input
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            placeholder="Describe the reason for admission"
                            required
                            className="border-[#7A51B3] text-[#563393] focus:border-[#563393]"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-4 bg-[#563393] text-white hover:bg-[#7A51B3]"
                    >
                        Pay Now
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BookBedModal;