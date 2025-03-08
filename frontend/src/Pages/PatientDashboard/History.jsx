import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Stethoscope,
  Bed,
  Pill,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import Cookies from 'js-cookie';


const History = () => {
  const [appointments, setAppointments] = useState(null);
  const [bedBookings, setBedBookings] = useState(null);
  const [medicines, setMedicines] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    const fetchAppointments = async () => {
      const email = Cookies.get('email');
      try {
        const response = await axios.post(
          "http://localhost:3000/history/user",
          { email },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setAppointments(response.data);
      } catch (err) {
        console.log(err);
        setError("Something went wrong while fetching appointments!");
      }
    };

    const fetchBedBookings = async () => {
      const email = Cookies.get('email');
      try {
        const response = await axios.post(
          "http://localhost:3000/history/bed",
          { email },
          {
            headers: {
              "Content-Type": "application/json",
            },
    
          }
        );
        console.log(response);
        setBedBookings(response.data);
      } catch (err) {
        console.log(err);
        setError("Something went wrong while fetching bed bookings!");
      }
    };

    // const fetchMedicines = async () => {
    //   const email = Cookies.get('email');
    //   try {
    //     const response = await axios.post(
    //       "http://localhost:3000/history/medicines",
    //       { email },
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );
    //     setMedicines(response.data);
    //   } catch (err) {
    //     console.log(err);
    //     setError("Something went wrong while fetching medicines!");
    //   }
    // };

    fetchAppointments();
    fetchBedBookings();
    console.log(bedBookings)
    // fetchMedicines();
    setLoading(false);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="text-green-500" />;
      case 'Pending':
        return <Clock className="text-yellow-500" />;
      case 'Delivered':
        return <CheckCircle className="text-green-500" />;
      case 'Processing':
        return <Clock className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const renderHistoryCards = (data, type) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((item) => (
        <Card key={item.id} className="flex items-center bg-white shadow-md">
          <div className="p-4">
            {type === 'appointments' && <Stethoscope className="text-[#563393] w-10 h-10" />}
            {type === 'bedBookings' && <Bed className="text-[#563393] w-10 h-10" />}
            {type === 'medicines' && <Pill className="text-[#563393] w-10 h-10" />}
          </div>
          <CardContent className="flex-grow p-4">
            <div className="flex justify-between items-center">
              <div>
              {type === 'appointments' && (
  <>
    <p className="font-semibold text-[#563393]">{item.doctor}</p>
    <p className="text-sm text-gray-600">{item.date} | {item.timeSlot}</p>
    {/* <p className="text-sm text-gray-500">{item.city},{item.state
      },{item.country}</p> */}
  </>
)}

                {type === 'bedBookings' && (
                  <>
                    <p className="font-semibold text-[#563393]">{item.hospitalname}</p>
                    {/* <p className="text-sm text-gray-500">{item.location}</p> */}
                  </>
                )}
                {/* {type === 'medicines' && (
                  <>
                    <p className="font-semibold text-[#563393]">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} | Order Date: {item.orderDate}
                    </p>
                  </>
                )} */}
              </div>
              <div className="flex items-center">
                {getStatusIcon(item.status)}
                <Badge className="ml-2">{item.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full rounded-none">
      <CardHeader className="">
        <CardTitle className="text-[#563393] flex items-center">
          <Calendar className="mr-2" /> Your History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 bg-[#563393]/10 mb-4 w-full md:h-11">
            <TabsTrigger
              value="appointments"
              className="text-[#563393] text-sm sm:text-base font-semibold data-[state=active]:bg-[#563393] data-[state=active]:text-white flex items-center justify-center rounded-sm"
            >
              <Stethoscope className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              <span className="truncate">Appointments</span>
            </TabsTrigger>
            <TabsTrigger
              value="bedBookings"
              className="text-[#563393] text-sm sm:text-base font-semibold data-[state=active]:bg-[#563393] data-[state=active]:text-white flex items-center justify-center rounded-sm"
            >
              <Bed className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              <span className="truncate">Bed Bookings</span>
            </TabsTrigger>
            {/* <TabsTrigger
              value="medicines"
              className="text-[#563393] text-sm sm:text-base font-semibold data-[state=active]:bg-[#563393] data-[state=active]:text-white flex items-center justify-center rounded-sm"
            >
              <Pill className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              <span className="truncate">Medicine Orders</span>
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="appointments">
            {appointments && renderHistoryCards(appointments, 'appointments')}
          </TabsContent>

          <TabsContent value="bedBookings">
            {bedBookings && renderHistoryCards(bedBookings, 'bedBookings')}
          </TabsContent>

          <TabsContent value="medicines">
            {medicines && renderHistoryCards(medicines, 'medicines')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  );
}

export default History;