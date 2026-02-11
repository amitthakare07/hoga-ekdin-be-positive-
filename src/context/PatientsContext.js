import React, { createContext, useContext, useState, useEffect } from "react";

const PatientsContext = createContext();

export const PatientsProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
      try {
        const parsed = JSON.parse(savedPatients);
        if (Array.isArray(parsed)) {
          setPatients(parsed);
        }
      } catch (error) {
        console.error('Error loading patients:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  // Generate unique ID
  const generateId = () => {
    return `PAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // Add patient
  const addPatient = (patientData) => {
    const newPatient = {
      id: generateId(),
      ...patientData,
      registeredDate: patientData.registeredDate || new Date().toISOString().split('T')[0],
      registeredTime: patientData.registeredTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  };

  // Update patient
  const updatePatient = (id, updatedData) => {
    setPatients(prev => 
      prev.map(patient => 
        patient.id === id ? { ...patient, ...updatedData } : patient
      )
    );
  };

  // Delete patient
  const deletePatient = (id) => {
    setPatients(prev => prev.filter(patient => patient.id !== id));
  };

  // Get patient stats
  const getPatientStats = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today.setDate(today.getDate() - 7));
    
    return {
      total: patients.length,
      male: patients.filter(p => p.gender === "Male").length,
      female: patients.filter(p => p.gender === "Female").length,
      other: patients.filter(p => p.gender === "Other").length,
      newThisWeek: patients.filter(p => new Date(p.registeredDate) >= oneWeekAgo).length,
    };
  };

  return (
    <PatientsContext.Provider value={{ 
      patients, 
      addPatient, 
      updatePatient, 
      deletePatient,
      getPatientStats 
    }}>
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientsContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientsProvider');
  }
  return context;
};

export default PatientsContext;