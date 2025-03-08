import React, { useState, useEffect } from 'react';
import { Check, X, Clock, UserPlus, ExpandIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import axios from 'axios';
import Cookie from 'js-cookie';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log(appointments);
        const email = Cookie.get('email');
        const response = await axios.post(
          "http://localhost:3000/list/appointment",
          { email },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log(response);
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching the appointments.");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleAppointmentAction = async(id, action) => {
    const approval = action === 'accept' ? 'confirmed' : 'Declined';
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === id
          ? { ...appointment, status } 
          : appointment
      )
    );
    let unique=appointments[0]._id;
    const response = await axios.post(
      "http://localhost:3000/list/update",
      { unique,approval },
      { headers: { "Content-Type": "application/json" } }
    );
    if(response.status==200)
      alert("Appointment status updated successfully");
    else
    alert("Failed to update appointment status");

    window.location.reload();
  };


  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  // Open dialog with full issue description
  const openIssueDialog = (issue) => {
    setSelectedIssue(issue);
    setIsDialogOpen(true);
  };

  // Render loading state
  if (loading) return <div className="loading">Loading appointments...</div>;

  // Render error state
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Card className="w-full rounded-none shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold md:text-3xl text-[#563393]">Appointment Management</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          {appointments.map((appointment) => (
            <div
              key={appointments.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border-b hover:bg-[#f4f4f4] transition-colors"
            >
              <div className="flex-grow mb-2 sm:mb-0 w-full sm:w-auto">
                <div className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5 text-[#563393]" />
                  <div className="font-bold text-sm sm:text-base">{appointment.patientName}</div>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600 mt-1 relative">
                  {truncateText(appointment.issue)}
                  {appointment.issue.length > 100 && (
                    <button
                      onClick={() => openIssueDialog(appointment.issue)}
                      className="ml-2 text-[#563393] hover:underline"
                      aria-label="View full issue description"
                    >
                      <ExpandIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                  <Clock className="mr-2 h-4 w-4" />
                  {appointment.date} | {appointment.timeSlot} Slot
                </div>
                <div
                  className={`text-xs sm:text-sm font-medium mt-1 ${
                    appointment.status === 'Pending'
                      ? 'text-yellow-600'
                      : appointment.status === 'Confirmed'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                >
                  {appointment.status}
                </div>
              </div>
              {appointment.status === 'pending' && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto text-[#563393] border-[#563393] hover:bg-[#cab2f479] hover:text-[#563393]"
                    onClick={() => handleAppointmentAction(appointment.id, 'accept')}
                    aria-label="Accept appointment"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto text-red-600 border-red-600 hover:bg-red-50 hover:text-red-500"
                    onClick={() => handleAppointmentAction(appointment.id, 'decline')}
                    aria-label="Decline appointment"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Decline
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[80vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#563393]">Full Issue Description</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-700">
            {selectedIssue}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentManagement;