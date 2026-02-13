import React, { createContext, useContext, useState, useEffect } from "react";

const AppointmentsContext = createContext();

export const AppointmentsProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      try {
        const parsed = JSON.parse(savedAppointments);
        if (Array.isArray(parsed)) {
          setAppointments(parsed);
          console.log("📂 Loaded appointments:", parsed.length); // DEBUG
        }
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem('appointments', JSON.stringify(appointments));
      console.log("💾 Saved appointments:", appointments.length); // DEBUG
    }
  }, [appointments]);

  const generateId = () => {
    return `APT-${Date.now()}`;
  };

  const addAppointment = (appointmentData) => {
    console.log("➕ Adding appointment:", appointmentData); // DEBUG
    
    const newAppointment = {
      id: generateId(),
      ...appointmentData,
      status: appointmentData.status || "Pending",
      bookingDate: appointmentData.bookingDate || new Date().toISOString().split('T')[0],
      bookingTime: appointmentData.bookingTime || new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
    };
    
    setAppointments(prev => {
      const updated = [...prev, newAppointment];
      console.log("✅ Updated appointments array:", updated.length); // DEBUG
      return updated;
    });
    
    return newAppointment;
  };

  const updateAppointment = (id, updatedData) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, ...updatedData } : apt)
    );
  };

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const getAppointmentStats = () => {
    const today = new Date().toISOString().split('T')[0];
    return {
      total: appointments.length,
      pending: appointments.filter(a => a?.status === "Pending").length,
      confirmed: appointments.filter(a => a?.status === "Confirmed").length,
      completed: appointments.filter(a => a?.status === "Completed").length,
      cancelled: appointments.filter(a => a?.status === "Cancelled").length,
      today: appointments.filter(a => a?.date === today).length,
    };
  };

  return (
    <AppointmentsContext.Provider value={{ 
      appointments, 
      addAppointment, 
      updateAppointment, 
      deleteAppointment,
      getAppointmentStats 
    }}>
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error('useAppointments must be used within AppointmentsProvider');
  }
  return context;
};

export default AppointmentsContext;