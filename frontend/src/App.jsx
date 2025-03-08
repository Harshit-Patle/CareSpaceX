import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./Pages/Authentication/SignUp";
import Login from "./Pages/Authentication/Login";
import DoctorDetails from "./Pages/DetailsForm/DoctorDetails";
import PatientDetails from "./Pages/DetailsForm/PatientDetails";
import HospitalDetails from "./Pages/DetailsForm/HospitalDetails";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import PatientProfile from "./Pages/PatientDashboard/Profile";
import DoctorAppointment from "./Pages/PatientDashboard/DoctorAppointment";
import BedBooking from "./Pages/PatientDashboard/BedBooking";
import OrderMedicine from "./Pages/PatientDashboard/OrderMedicine";
import History from "./Pages/PatientDashboard/History";
import DoctorProfile from "./Pages/DoctorDashboard/Profile";
import AppointmentManagement from "./Pages/DoctorDashboard/AppointmentManagement";
import ChatWithDoctor from "./Pages/PatientDashboard/ChatWithDoctor";
import ChatWithPatient from "./Pages/DoctorDashboard/ChatWithPatient";
import Home from "./Pages/Home";
import HospitalProfile from "./Pages/HospitalDashboard/Profile";
import InventoryManagement from "./Pages/HospitalDashboard/InventoryManagement";
import GetInventory from "./Pages/HospitalDashboard/GetInventory";
import BedManagement from "./Pages/HospitalDashboard/BedManagement";
import DoctorManagement from "./Pages/AdminDashboard/DoctorManagement";
import HospitalManagement from "./Pages/AdminDashboard/HospitalManagement";
import MedicineOverview from "./Pages/MedicineOverview";
import Chatbot from "./Components/Chatbot";
import Cookies from "js-cookie";
import PatientHistory from "./Pages/DoctorDashboard/PatientHistory";
import Prescription from "./Pages/DoctorDashboard/Prescription";
import MedicineAnalyzer from "./Pages/DoctorDashboard/MedicineAnalyzer";

function App() {
  const [userRole, setUserRole] = useState("doctor");

  useEffect(() => {
    const role = Cookies.get("role");
    setUserRole(role);
  }, []);

  return (
    <Router>
      <div className="h-screen flex flex-col">
        <Header className="h-16 shrink-0 top-0 fixed" />

        <div className="flex flex-1 overflow-hidden">
          {userRole && userRole !== '' && (
            <Sidebar
              userRole={userRole}
              className="w-64 overflow-y-auto border-r"
            />
          )}

          <main className="flex-1 overflow-y-auto relative bg-[#eef5f5cb]">
            <div className="">
              <Routes>
                <Route path="/signup" element={<SignUp />} />
                {userRole == null && (<Route path="/" element={<Home />} />)}
                <Route path="/login" element={<Login />} />
                <Route path="/medicine-overview" element={<MedicineOverview />} />
                <Route path="/medicine-analyzer" element={<MedicineAnalyzer />} />
                <Route path="/chat-support" element={<Chatbot />} />
                {/* Details Form */}
                <Route path="/doctor-detail-form" element={<DoctorDetails />} />
                <Route path="/patient-detail-form" element={<PatientDetails />} />
                <Route path="/hospital-detail-form" element={<HospitalDetails />} />
                {/* Patient Dashboard */}
                <Route path="/patient-profile" element={<PatientProfile />} />
                <Route path="/doctor-appointment" element={<DoctorAppointment />} />
                <Route path="/bed-booking" element={<BedBooking />} />
                {/* <Route path="/order-medicine" element={<OrderMedicine />} /> */}
                {/* <Route path="/chat-with-doctor" element={<ChatWithDoctor />} /> */}
                <Route path="/history" element={<History />} />
                {/* Doctor Dashboard */}
                <Route path="/doctor-profile" element={<DoctorProfile />} />
                <Route path="/appointment-management" element={<AppointmentManagement />} />
                <Route path="/patients-history" element={<PatientHistory />} />
                {/* <Route path="/chat-with-patient" element={<ChatWithPatient />} /> */}
                <Route path="/prescription" element={<Prescription />} />

                {/* Hospital Dashboard */}
                <Route path="/hospital-profile" element={<HospitalProfile />} />
                <Route path="/inventory-management" element={<InventoryManagement />} />
                <Route path="/bed-management" element={<BedManagement />} />
                <Route path="/get-inventory" element={<GetInventory />} />
                {/* Admin Dashboard */}
                <Route path="/doctor-management" element={<DoctorManagement />} />
                <Route path="/hospital-management" element={<HospitalManagement />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;