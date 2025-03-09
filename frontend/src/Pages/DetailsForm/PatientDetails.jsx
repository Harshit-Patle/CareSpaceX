import React, { useState } from "react";
import { Country, State, City } from "country-state-city";
import { Label } from "@/Components/ui/label";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import Select from "react-select";
import Cookies from 'js-cookie';
import axios from 'axios';
import { DatePicker } from "@/Components/DatePicker";
import { useNavigate } from 'react-router-dom';


function PatientDetails() {
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    country: null,
    state: null,
    city: null,
    pinCode: "",
    gender: null,
    weight: "",
    height: "",
    bloodGroup: null,
    email: "",
    role: null,
    phone: "",
    date: null,
  });
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#824edc",
      "&:hover": { borderColor: "#6d46af" },
      boxShadow: "none",
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? "#6d46af"
        : isFocused
          ? "#e6e0f6"
          : "white",
      color: isSelected ? "white" : "#333",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#6d46af",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
    }),
  };

  const handleCountryChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      country: selectedOption,
      state: null,
      city: null,
    }));
  };

  const handleStateChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      state: selectedOption,
      city: null,
    }));
  };

  const handleCityChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      city: selectedOption,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailFromCookie = Cookies.get('email');
    const roleFromCookie = Cookies.get('role');  
    Cookies.set('isLoggedIn', true);

    const submissionData = {
      ...formData,
      email: emailFromCookie,
      role: roleFromCookie, 
      phone: phone,
      date: date,
    };

    try {
      const res = await axios.post(`${backendURL}/detail/userdetail`, submissionData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        navigate('/patient-profile');
      } else {
        alert("Failed to submit form");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit form");
    }
  };

  return (
    <div className="w-11/12 max-w-md mx-auto p-4 sm:p-6 bg-white shadow-2xl rounded-xl">
      <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
        <h1 className="text-xl sm:text-2xl font-bold text-center text-[#6d46af] mb-4 sm:mb-6">
          Patient Details
        </h1>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-sm font-medium">
            Phone Number
          </Label>
          <PhoneInput
            inputClassName="!w-full !py-2 !px-3 !border !rounded-md focus:!border-[#6d46af]"
            country={"in"}
            value={phone}
            onChange={(phone) => setPhone(phone)}
            required
            className="w-full hover:border-[#6d46af] border-[#824edc] text-[#6d46af]"
          />
        </div>

        {/* Gender and Date of Birth */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 md:gap-0">
          <div className="space-y-2 md:w-fit">
            <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
            <Select
              styles={customStyles}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              value={formData.gender}
              onChange={(selectedOption) => setFormData((prev) => ({ ...prev, gender: selectedOption }))}
              placeholder="Select Gender"
              required
            />
          </div>
          <DatePicker
            value={date}
            onChange={setDate}
            required={true}
          />
        </div>

        {/* Weight and Height */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium">Weight (KG)</Label>
            <Input
              type="number"
              placeholder="Enter Weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full hover:border-[#6d46af] border-[#824edc] text-[#6d46af]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium">Height (CM)</Label>
            <Input
              type="number"
              placeholder="Enter Height"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="w-full hover:border-[#6d46af] border-[#824edc] text-[#6d46af]"
              required
            />
          </div>
        </div>

        {/* Blood Group */}
        <div className="space-y-2">
          <Label htmlFor="bloodGroup" className="text-sm font-medium">Blood Group</Label>
          <Select
            styles={customStyles}
            options={[
              { value: "a+", label: "A+" },
              { value: "b+", label: "B+" },
              { value: "ab+", label: "AB+" },
              { value: "o+", label: "O+" },
            ]}
            value={formData.bloodGroup}
            onChange={(selectedOption) => setFormData((prev) => ({ ...prev, bloodGroup: selectedOption }))}
            placeholder="Select Blood Group"
            className="mb-2"
            required
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Location</Label>
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 mb-2">
            <Select
              styles={customStyles}
              options={Country.getAllCountries().map((country) => ({
                value: country.isoCode,
                label: country.name,
              }))}
              value={formData.country}
              onChange={handleCountryChange}
              placeholder="Select Country"
              required
            />
            {formData.country && (
              <Select
                styles={customStyles}
                options={State.getStatesOfCountry(formData.country.value).map((state) => ({
                  value: state.isoCode,
                  label: state.name,
                }))}
                value={formData.state}
                onChange={handleStateChange}
                placeholder="Select State"
                required
              />
            )}
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
            {formData.state && (
              <Select
                styles={customStyles}
                options={City.getCitiesOfState(formData.country.value, formData.state.value).map((city) => ({
                  value: city.name,
                  label: city.name,
                }))}
                value={formData.city}
                onChange={handleCityChange}
                placeholder="Select City"
                required
              />
            )}
            <Input
              type="number"
              placeholder="Pin Code"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleInputChange}
              className="w-full hover:border-[#6d46af] border-[#824edc] text-[#6d46af]"
              maxLength={6}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#6d46af] hover:bg-[#5a3a8f] text-white"
        >
          Submit Details
        </Button>
      </form>
    </div>
  );
}

export default PatientDetails;
