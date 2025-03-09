import React, { useState,useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import axios from 'axios';
import Cookie from 'js-cookie';

const BedManagement = () => {
  const [beds, setBeds] = useState([]);
   const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchbed = async () => {
      try {
        const email = Cookie.get('email');
        const response = await axios.post(
          `${backendURL}/list/bed`,
          { email },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log(response);
        setBeds(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching the appointments.");
        setLoading(false);
      }
    };

    fetchbed();
  }, []);

  if (loading) return <div className="loading">Loading appointments...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleAction = async (id, action) => {
    const approval = action === 'accept' ? 'confirmed' : 'Declined';
  
    setBeds(prevBeds =>
      prevBeds.map(bed =>
        bed.id === id
          ? { ...bed, status: approval }
          : bed
      )
    );
  
    const unique = beds[0]._id;
    console.log(unique,approval);
  
    try {
      const response = await axios.post(
        `${backendURL}/list/updatebed`, 
        { unique, approval },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(unique,approval);
      if (response.status === 200) {
        alert("Bed status updated successfully");
      } else {
        alert("Failed to update bed status");
      }
    } catch (error) {
      console.error("Error updating bed status", error);
      alert("Error updating bed status");
    }
  };
  

  return (
    <Card className="w-full rounded-none shadow-none bg-white">
      <CardHeader className="bg-white">
        <CardTitle className="text-lg font-bold md:text-3xl text-[#563393]">Bed Management</CardTitle>
      </CardHeader>
      <CardContent className="p-1 bg-white">
        {beds.map((bed) => (
          <div
            key={bed.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border-b border-[#563393]/20 hover:bg-[#563393]/5 transition-colors bg-white"
          >
            <div className="flex-grow mb-2 sm:mb-0">
              <div className="text-sm font-medium text-[#563393]">
                Patient: {bed.patient}
              </div>
              <div className="text-sm text-[#563393]/70">
                Issue: {bed.issue}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {bed.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-white text-[#563393] border-[#563393] hover:bg-[#563393]/10 hover:text-[#563393]"
                    onClick={() => handleAction(bed.id, 'accept')}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-white text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleAction(bed.id, 'decline')}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Decline
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BedManagement;