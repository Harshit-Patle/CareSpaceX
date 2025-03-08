import React, { useState } from "react";
import { Country, State, City } from "country-state-city";
import { Label } from "@/Components/ui/label";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/Components/ui/input";
import Cookies from 'js-cookie';
import axios from 'axios';

function HospitalDetails() {
  // Initial state
  const [formData, setFormData] = useState({
    phone: "",
    country: null,
    state: null,
    city: null,
    pinCode: "",
    certificate: null,
    specializations: [],
    role: "",
    email: "",
    bedCharge: "",
    bedsAvailable: "", // Added new field for beds available
  });
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Custom styles for Select components
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
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#e6e0f6",
      color: "#6d46af",
      margin: '2px',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#6d46af",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#6d46af",
      ':hover': {
        backgroundColor: "#824edc",
        color: 'white',
      },
    }),
    valueContainer: (base) => ({
      ...base,
      flexWrap: 'wrap',
      maxHeight: '40px',
      overflowY: 'auto',
    }),
  };

  // Handle regular input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select input changes
  const handleSelectChange = (field, selectedOption) => {
    setFormData((prev) => ({ ...prev, [field]: selectedOption }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Only PDF files are accepted. Please upload a valid PDF document.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB. Please upload a smaller file.");
        return;
      }
      setFormData((prev) => ({ ...prev, certificate: file }));
    }
  };

  // Handle country selection
  const handleCountryChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      country: selectedOption,
      state: null,
      city: null,
    }));
  };

  // Handle state selection
  const handleStateChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      state: selectedOption,
      city: null,
    }));
  };

  // Handle city selection
  const handleCityChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, city: selectedOption }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate pin code
    if (!/^[0-9]{6}$/.test(formData.pinCode)) {
      alert("Pin Code must be exactly 6 digits.");
      return;
    }

    // Validate bed charge
    if (formData.bedCharge && (isNaN(formData.bedCharge) || formData.bedCharge <= 0)) {
      alert("Please enter a valid bed charge amount.");
      return;
    }

    // Validate beds available
    if (formData.bedsAvailable && (isNaN(formData.bedsAvailable) || formData.bedsAvailable <= 0 || !Number.isInteger(Number(formData.bedsAvailable)))) {
      alert("Please enter a valid number of beds available (must be a positive integer).");
      return;
    }

    // Get data from cookies
    const emailFromCookie = Cookies.get('email');
    const role = Cookies.get('role');

    // Update formData with cookie values
    setFormData(prev => ({
      ...prev,
      email: emailFromCookie,
      role: role,
    }));

    try {
      const res = await axios.post(
        `${backendURL}/detail/hospitaldetail`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        alert("Your profile is under review");
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
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-[#6d46af] mb-4 sm:mb-6">
          Hospital Details
        </h1>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <PhoneInput
            inputClassName="!w-full !py-2 !px-3 !border !rounded-md focus:!border-[#6d46af]"
            country={"in"}
            value={formData.phone}
            onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
            required
            className="w-full hover:border-[#6d46af] border-[#824edc] text-[#6d46af]"
          />
        </div>

        {/* Bed Information Section */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
          {/* Beds Available */}
          <div className="space-y-2">
            <Label htmlFor="bedsAvailable" className="text-sm font-medium">
              Number of Beds Available
            </Label>
            <Input
              type="number"
              name="bedsAvailable"
              placeholder="Enter number of beds"
              value={formData.bedsAvailable}
              onChange={handleInputChange}
              min="1"
              step="1"
              className="w-full hover:border-[#6d46af] border-[#824edc] text-[#6d46af]"
              required
            />
          </div>

          {/* Bed Charge */}
          <div className="space-y-2">
            <Label htmlFor="bedCharge" className="text-sm font-medium">
              Bed Charge (INR per day)
            </Label>
            <Input
              type="number"
              name="bedCharge"
              placeholder="Enter bed charge"
              value={formData.bedCharge}
              onChange={handleInputChange}
              min="0"
              step="1"
              className="w-full hover:border-[#6d46af] border-[#824edc] text-[#6d46af]"
              required
            />
          </div>
        </div>

        {/* Certificate Upload */}
        <div className="space-y-2">
          <Label htmlFor="certificate" className="text-sm font-medium">
            Upload Certification (PDF only)
          </Label>
          <p className="text-xs text-gray-500">
            Please upload a valid document proving your hospital's credentials. Only PDF files are accepted (Max size: 5MB).
          </p>
          <Input
            type="file"
            accept=".pdf"
            name="certificate"
            onChange={handleFileChange}
            className="w-full"
            required
          />
        </div>

        {/* Specializations */}
        <div className="space-y-2">
          <Label htmlFor="specializations" className="text-sm font-medium">
            Specializations
          </Label>
          <Select
            styles={customStyles}
            isMulti
            options={[
              { value: "cardiology", label: "Cardiology" },
              { value: "neurology", label: "Neurology" },
              { value: "pediatrics", label: "Pediatrics" },
              { value: "orthopedics", label: "Orthopedics" },
              { value: "general", label: "General Medicine" },
            ]}
            value={formData.specializations}
            onChange={(selectedOptions) => handleSelectChange("specializations", selectedOptions)}
            placeholder="Select Specializations"
            required
            className="w-full hover:border-[#6d46af] border-[#824edc] text-[#6d46af]"
          />
        </div>

        {/* Location Fields */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Location</Label>
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
            {/* Country Select */}
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
            {/* State Select */}
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
            {/* City Select */}
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
            {/* Pin Code Input */}
            <Input
              type="number"
              placeholder="Pin Code"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleInputChange}
              className="w-full hover:border-[#6d46af] border-[#824edc] text-[#6d46af]"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
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

export default HospitalDetails;