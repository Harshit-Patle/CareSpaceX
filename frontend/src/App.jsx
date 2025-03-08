import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./Pages/Authentication/SignUp";
import Header from "./Components/Header";
import HomePage from "./Pages/Home";
import Login from "./Pages/Authentication/Login";
import DoctorDetails from "./Pages/DetailsForm/DoctorDetails";
import PatientDetails from "./Pages/DetailsForm/PatientDetails";
import HospitalDetails from "./Pages/DetailsForm/HospitalDetails";
import Cookies from "js-cookie";
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

          <main className="flex-1 overflow-y-auto relative">
            <div className="">
              <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />

                {/* Details Form */}
                <Route path="/doctor-detail-form" element={<DoctorDetails />} />
                <Route path="/patient-detail-form" element={<PatientDetails />} />
                <Route path="/hospital-detail-form" element={<HospitalDetails />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;