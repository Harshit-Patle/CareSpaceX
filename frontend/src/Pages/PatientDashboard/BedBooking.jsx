import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input"
import BookBed from './BookBed';
import axios from 'axios';
import Cookies from 'js-cookie';
import debounce from 'lodash.debounce';
import {
  MapPin,
  Stethoscope,
  DollarSign,
  Search,
  User,
  Calendar,
  ArrowRight,
  Bed,
} from "lucide-react";


const BedBooking = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const city = Cookies.get('city');
        const state = Cookies.get('state');
        const country = Cookies.get('country');
        const response = await axios.post(
          `${backendURL}/hospital/new`, 
          { city, state, country },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log(response)
        setHospitals(response.data.doctors);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch hospitals. Please try again later.");
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);


  if (loading) return <div>Loading hospitals...</div>;
  if (error) return <div>{error}</div>;

  return <BookHospitalBed hospitals={hospitals} />;
};

const BookHospitalBed = ({ hospitals }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);



  const filteredHospitals = hospitals.filter((hospital) =>
    `${hospital.name} ${hospital.specialization} ${hospital.location}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = debounce((e) => {
    setSearchTerm(e.target.value);
  }, 500);
  

  const handleBookBed = (hospital) => {
    setSelectedHospital(hospital);
    Cookies.set('Charges', hospital.charges);
    Cookies.set('hospital', hospital.email);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHospital(null);
  };

  return (
    <div className="p-5" style={{ color: "#563393" }}>
      <div className="flex items-center mb-6">
        <Bed size={32} color="#563393" className="mr-3" />
        <h1 className="text-3xl font-bold" style={{ color: "#563393" }}>
          Book a Hospital Bed
        </h1>
      </div>
  
      <div className="relative mb-6">
        <Search size={20} color="#563393" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
        <Input
          aria-label="Search by hospital name, specialization, or location"
          placeholder="Search by hospital name, specialization, or location..."
          className="pl-10 border-2"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ borderColor: "#563393", color: "#563393" }}
        />
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hospital) => (
          <Card
            key={hospital.id}
            className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ backgroundColor: "white", border: "2px solid #563393" }}
          >
            <CardHeader className="flex flex-row items-center space-x-3">
              <Stethoscope size={24} color="#563393" />
              <CardTitle className="text-xl" style={{ color: "#563393" }}>
                {hospital.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm flex items-center" style={{ color: "#563393" }}>
                  <Stethoscope size={16} className="mr-2" />
                  <strong>Specializations:</strong> {hospital.specializations}
                </p>
                <p className="text-sm flex items-center" style={{ color: "#563393" }}>
                  <DollarSign size={16} className="mr-2" />
                  <strong>Price per night:</strong> ₹{hospital.charges}
                </p>
                <p className="text-sm flex items-center" style={{ color: "#563393" }}>
                  <MapPin size={16} className="mr-2" />
                  <strong>Location:</strong>  {`${hospital.name}, ${hospital.city}, ${hospital.state}, ${hospital.country}`}
                </p>
                <p className="text-sm flex items-center" style={{ color: "#563393" }}>
                  <Bed size={16} className="mr-2" />
                  <strong>Available Beds:</strong> {hospital.availableBeds}
                </p>
              </div>
              <Button
              onClick={() => handleBookBed(hospital)}
              className="w-full flex items-center justify-center hover:bg-[#6F4BA3]"
              style={{ backgroundColor: "#563393", color: "white" }}
              >
      <Bed size={16} className="mr-2" />
      Book Bed
      <ArrowRight size={16} className="ml-2" />
    </Button>
            </CardContent>
          </Card>
        ))}
      </div>
  
      {filteredHospitals.length === 0 && (
        <div className="text-center mt-4 flex flex-col items-center justify-center" style={{ color: "#563393" }}>
          <Search size={48} color="#563393" className="mb-4" />
          <p className="text-lg">No hospitals found matching your search.</p>
        </div>
      )}
  
      {selectedHospital && (
        <BookBed
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          hospitalName={selectedHospital.name}
          pricePerNight={selectedHospital.pricePerNight}
        />
      )}
    </div>
  );
  
};

export default BedBooking;
