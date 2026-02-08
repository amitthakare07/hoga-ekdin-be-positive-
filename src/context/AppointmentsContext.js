import React, { createContext, useContext, useState } from "react";

// ==================== APPOINTMENTS CONTEXT ====================
// Global state management for appointments
// Allows sharing appointment data between DashboardHome and Appointments pages

// Create the context
const AppointmentsContext = createContext();

// Provider component
export const AppointmentsProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      patientName: "Aarav Patel", 
      symptoms: "Chest Pain, Shortness of Breath",
      date: "2025-01-20", 
      time: "10:00 AM", 
      status: "Confirmed", 
      type: "Cardiology" 
    },
    { 
      id: 2, 
      patientName: "Aanya Sharma", 
      symptoms: "Palpitations, Dizziness",
      date: "2025-01-20", 
      time: "11:00 AM", 
      status: "Pending", 
      type: "Cardiology" 
    },
    { 
      id: 3, 
      patientName: "Arjun Singh", 
      symptoms: "High Blood Pressure",
      date: "2025-01-21", 
      time: "09:00 AM", 
      status: "Completed", 
      type: "Cardiology" 
    },
  ]);

  // Add new appointment
  const addAppointment = (appointment) => {
    const newAppointment = {
      id: appointments.length + 1,
      ...appointment,
      status: "Confirmed",
    };
    setAppointments([...appointments, newAppointment]);
    return newAppointment;
  };

  // Update existing appointment
  const updateAppointment = (id, updatedData) => {
    setAppointments(appointments.map((apt) => 
      apt.id === id ? { ...apt, ...updatedData } : apt
    ));
  };

  // Delete appointment
  const deleteAppointment = (id) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };

  return (
    <AppointmentsContext.Provider value={{ appointments, addAppointment, updateAppointment, deleteAppointment }}>
      {children}
    </AppointmentsContext.Provider>
  );
};

// Custom hook for using appointments context
export const useAppointments = () => {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentsProvider');
  }
  return context;
};

export default AppointmentsContext;

