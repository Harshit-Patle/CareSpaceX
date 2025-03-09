import React, { useState } from "react";
import { Country, State, City } from "country-state-city";
import { Label } from "@/Components/ui/label";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import axios from 'axios';
import Cookies from 'js-cookie';

function DoctorDetails() {
  const [formData, setFormData] = useState({
    phone: "",
    gender: null,
    specialization: null,
    language: [],
    charges: "",
    hospital: "",
    certificate: null,
    country: null,
    state: null,
    city: null,
    pinCode: "",
    role: "",
    email: "",
  });
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#824edc",
      "&:hover": { borderColor: "#6d46af" },
      boxShadow: "none",
      overflowY: 'auto',
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, selectedOption) => {
    if (field === 'language') {
      setFormData({
        ...formData,
        [field]: selectedOption, // For multi-select, we set the array of selected options
      });
    } else {
      setFormData({
        ...formData,
        [field]: selectedOption ? selectedOption : null, // For single-select, we set the selected object (or null)
      });
    }
  };

  const handleFileChange = async (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailFromCookie = Cookies.get('email');
    const role = Cookies.get('role');
    setFormData({
      ...formData,
      email: emailFromCookie,
      role: role,
    });

    try {
      const res = await axios.post(`${backendURL}/detail/doctordetail`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);

      if (res.status !== 200) {
        alert('Failed to send OTP');
      }
      else
        alert('Your profile is under review');
    } catch (error) {
      alert(error.message);
    }
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
    setFormData((prev) => ({ ...prev, city: selectedOption }));
  };

  return (
    <div className="w-11/12 max-w-md mx-auto p-4 sm:p-6 bg-white shadow-2xl rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-[#6d46af] mb-4 sm:mb-6">
          Doctor Details
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

        {/* Gender and Specialization */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
            <Select
              styles={customStyles}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              value={formData.gender} // It should be an object with both value and label
              onChange={(selectedOption) => handleSelectChange("gender", selectedOption)}
              placeholder="Select Gender"
              required
              className="md:w-max md:pr-5"
            />
          </div>
          <div className="space-y-2 md:-ml-7">
            <Label htmlFor="specialization" className="text-sm font-medium">
              Specialization
            </Label>
            <Select
              styles={customStyles}
              options={[
                { value: "cardiology", label: "Cardiology" },
                { value: "neurology", label: "Neurology" },
                { value: "pediatrics", label: "Pediatrics" },
                { value: "general", label: "General Medicine" },
              ]}
              value={formData.specialization} // It should be an object with both value and label
              onChange={(selectedOption) => handleSelectChange("specialization", selectedOption)}
              placeholder="Select Specialization"
              required
              className="md:w-max md:pr-5"
            />
          </div>
        </div>

        {/* Language and Charges */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm font-medium">
              Languages Known
            </Label>
            <Select
              styles={customStyles}
              isMulti
              options={[
                { value: "english", label: "English" },
                { value: "hindi", label: "Hindi" },
                { value: "spanish", label: "Spanish" },
                { value: "french", label: "French" },
              ]}
              value={formData.language} // This should be an array of objects
              onChange={(selectedOptions) => handleSelectChange("language", selectedOptions)}
              placeholder="Select Languages"
              required
              className="md:w-[222px] md:max-h-[30px] md:pr-5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="charges" className="text-sm font-medium">
              Consultation Charges (₹)
            </Label>
            <Input
              type="number"
              placeholder="Enter Charges"
              name="charges"
              value={formData.charges}
              onChange={handleInputChange}
              className="w-full hover:border-[#6d46af] border-[#824edc] text-[#6d46af]"
              required
            />
          </div>
        </div>

        {/* Hospital or Clinic */}
        <div className="space-y-2">
          <Label htmlFor="hospital" className="text-sm font-medium">
            Hospital or Clinic (Optional)
          </Label>
          <Input
            type="text"
            placeholder="Enter Hospital or Clinic"
            name="hospital"
            value={formData.hospital}
            onChange={handleInputChange}
            className="w-full hover:border-[#6d46af] border-[#824edc] text-[#6d46af]"
          />
        </div>

        {/* Certificate */}
        <div className="space-y-2">
          <Label htmlFor="certificate" className="text-sm font-medium">
            Upload Medical Certification (PDF only)
          </Label>
          <p className="text-xs text-gray-500">
            Please upload a valid document proving your medical credentials, such as your medical license, degree, or board certification. Only PDF files are accepted (Max size: 5MB).
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

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Location</Label>
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
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

export default DoctorDetails;