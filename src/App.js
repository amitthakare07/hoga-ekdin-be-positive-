import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// ==================== IMPORT COMPONENTS ====================
import HomePages from "./Webpages/HomePages";
import ReceptionistDashboard from "./Webpages/ReceptionistDashboard";
import DashboardHome from "./Webpages/DashboardHome";
import Appointments from "./Webpages/Appointments";
import Patients from "./Webpages/Patients";
import AdmitPatients from "./Webpages/AdmitPatients";
import Doctors from "./Webpages/Doctors";
import Laboratory from "./Webpages/Laboratory";
import Services from "./Webpages/Services";
import Signup from "./Webpages/Signup";
import DoctorDashboard from "./Webpages/DoctorDashboard";
import DoctorDashboardHome from "./Webpages/doctor/DoctorDashboardHome";
import DoctorAppointments from "./Webpages/doctor/DoctorAppointments";
import DoctorPatients from "./Webpages/doctor/DoctorPatients";
import DoctorProfile from "./Webpages/doctor/DoctorProfile";

// ==================== IMPORT CONTEXTS ====================
import { AppointmentsProvider } from "./context/AppointmentsContext";
import { PatientsProvider } from "./context/PatientsContext";
import { AdmissionsProvider } from "./context/AdmissionsContext";

function App() {
  const location = useLocation();

  return (
    <AppointmentsProvider>
      <PatientsProvider>
        <AdmissionsProvider>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePages />} />
              <Route path="/signup" element={<Signup />} />

              {/* DOCTOR DASHBOARD */}
              <Route path="/doctor-dashboard" element={<DoctorDashboard />}>
                <Route index element={<DoctorDashboardHome />} />
                <Route path="appointments" element={<DoctorAppointments />} />
                <Route path="patients" element={<DoctorPatients />} />
                <Route path="profile" element={<DoctorProfile />} />
              </Route>

              {/* RECEPTIONIST DASHBOARD */}
              <Route path="/receptionist-dashboard" element={<ReceptionistDashboard />}>
                <Route index element={<DashboardHome />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="patients" element={<Patients />} />
                <Route path="admit-patients" element={<AdmitPatients />} />
                <Route path="doctors" element={<Doctors />} />
                <Route path="laboratory" element={<Laboratory />} />
                <Route path="services" element={<Services />} />
              </Route>

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </AdmissionsProvider>
      </PatientsProvider>
    </AppointmentsProvider>
  );
}

export default App;