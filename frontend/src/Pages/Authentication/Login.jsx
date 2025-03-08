import React, { useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    role: "",
  });

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/sign/login",
        {
          email: formData.email,
          otp: formData.otp,
          role: formData.role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (res.status !== 200) {
        alert("OTP wrong");
      } else {
        Cookies.set('city', res.data.city);
        Cookies.set('state', res.data.state);
        Cookies.set('country', res.data.country);
        Cookies.set('isLoggedIn', true);
        Cookies.set('name', res.data.name);
        Cookies.set('role', formData.role);

        alert("OTP verified successfully");

        // Navigate based on role
        if (formData.role === 'patient') {
          navigate("/patient-profile");
        } else if (formData.role === 'doctor') {
          navigate("/doctor-profile");
        } else if (formData.role === 'admin') {
          navigate("/doctor-management");
        } else {
          navigate("/hospital-profile");
        }
      }
    } catch (error) {
      alert(error.message || "An error occurred during login.");
    }
  };

  const handleOtpChange = (otpValue) => {
    setFormData((prevData) => ({
      ...prevData,
      otp: otpValue,
    }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email!");
      return;
    }
    Cookies.set('email', formData.email, { expires: 1 / 24 });

    try {
      setShowModal(true);
      const res = await axios.post("http://localhost:3000/sign/signin", formData);

      if (res.status === 200) {
        alert("OTP sent successfully!");
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      alert(errorMessage || "Failed to send OTP");
    }
  };

  return (
    <div className="flex items-center justify-center h-[89vh] bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center lg:gap-7 shadow-md rounded-xl lg:p-10 bg-white gap-5 p-6"
      >
        <h1 className="text-2xl font-bold text-[#563393]">Login</h1>

        <div className="flex flex-col lg:gap-2 lg:w-80">
          <Label htmlFor="email" className="text-base font-normal">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-label="Email input field"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="role" className="text-base font-normal">
            Select Your Role
          </Label>
          <Select
            required
            onValueChange={(value) =>
              setFormData((prevData) => ({ ...prevData, role: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Your Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="hospital">Hospital</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          onClick={handleSendOtp}
          className="w-40"
          variant="ours"
        >
          Send OTP
        </Button>

        <div className="mt-4 text-sm">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#7f53cb] hover:underline">
              Sign up here
            </Link>
          </p>
        </div>

        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            aria-modal="true"
            role="dialog"
          >
            <div className="bg-white lg:p-10 rounded-lg shadow-md lg:w-96 p-5">
              <h2 className="lg:text-xl text-lg font-bold lg:mb-4 text-[#563393] mb-3">Verify OTP</h2>

              <div>
                <Label htmlFor="otp" className="text-base font-normal">
                  Enter OTP
                </Label>
                <InputOTP maxLength={6} onChange={handleOtpChange} required>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex items-center justify-end lg:gap-4 mt-4 gap-2">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  variant="destructive"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="ours">
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
