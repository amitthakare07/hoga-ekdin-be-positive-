import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// ==================== IMPORT COMPONENTS ====================
import HomePages from "./Webpages/HomePages";
import ReceptionistDashboard from "./Webpages/ReceptionistDashboard";
import DashboardHome from "./Webpages/DashboardHome";
import AppointmentForm from "./Webpages/AppointmentForm";
import Appointment from "./Webpages/Appointment";
import PatientRegistrationForm from "./Webpages/PatientRegistrationForm";
import AdmitPatientForm from "./Webpages/AdmitPatientForm";
import BedView from "./Webpages/doctor/BedView";
import Doctors from "./Webpages/Doctors";
import Laboratory from "./Webpages/Laboratory";
import Services from "./Webpages/Services";
import SignupForm from "./Webpages/SignupForm";
import DoctorDashboard from "./Webpages/DoctorDashboard";
import DoctorDashboardHome from "./Webpages/doctor/DoctorDashboardHome";
import DoctorAppointments from "./Webpages/doctor/DoctorAppointments";
import DoctorPatients from "./Webpages/doctor/DoctorPatients";
import DoctorProfile from "./Webpages/doctor/DoctorProfile";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePages />} />
        <Route path="/signupform" element={<SignupForm />} />

        {/* DOCTOR DASHBOARD ROUTES */}
        <Route path="/doctor-dashboard" element={<DoctorDashboard />}>
          <Route index element={<DoctorDashboardHome />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>

        {/* RECEPTIONIST DASHBOARD ROUTES */}
        <Route path="/receptionist-dashboard" element={<ReceptionistDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="appointmentsform" element={<AppointmentForm />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="patientregistrationform" element={<PatientRegistrationForm />} />
          <Route path="admit-patient" element={<AdmitPatientForm />} />
          <Route path="bedview" element={<BedView />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="laboratory" element={<Laboratory />} />
          <Route path="services" element={<Services />} />
        </Route>

        {/* 404 REDIRECT */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;