import React, { createContext, useContext, useState, useEffect } from "react";

// ==================== PATIENTS CONTEXT ====================
// COMPLETELY DYNAMIC - ZERO STATIC DATA
// Sab kuch localStorage se aata hai

const PatientsContext = createContext();

export const PatientsProvider = ({ children }) => {
  // 🚫 NO STATIC DATA - Sirf empty array
  const [patients, setPatients] = useState([]);

  // ✅ Load from localStorage
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
        setPatients([]);
      }
    }
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    if (patients.length > 0) {
      localStorage.setItem('patients', JSON.stringify(patients));
    } else {
      localStorage.removeItem('patients');
    }
  }, [patients]);

  // ✅ Generate unique ID
  const generateId = () => {
    return `PAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // ✅ Add patient
  const addPatient = (patientData) => {
    const newPatient = {
      id: generateId(),
      ...patientData,
      symptoms: Array.isArray(patientData.symptoms) 
        ? patientData.symptoms.join(", ") 
        : patientData.symptoms || "",
      registeredDate: patientData.registeredDate || new Date().toISOString().split('T')[0],
      registeredTime: patientData.registeredTime || new Date().toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: false 
      }),
    };
    
    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  };

  // ✅ Update patient
  const updatePatient = (id, updatedData) => {
    setPatients(prev => 
      prev.map(patient => 
        patient.id === id 
          ? { 
              ...patient, 
              ...updatedData,
              symptoms: Array.isArray(updatedData.symptoms) 
                ? updatedData.symptoms.join(", ") 
                : updatedData.symptoms || patient.symptoms
            } 
          : patient
      )
    );
  };

  // ✅ Delete patient
  const deletePatient = (id) => {
    setPatients(prev => prev.filter(patient => patient.id !== id));
  };

  // ✅ Get patient by ID
  const getPatientById = (id) => {
    return patients.find(patient => patient.id === id);
  };

  // ✅ Search patients
  const searchPatients = (query) => {
    if (!query) return patients;
    const lowercaseQuery = query.toLowerCase();
    return patients.filter(patient => 
      patient.patientName?.toLowerCase().includes(lowercaseQuery) ||
      patient.phone?.includes(query) ||
      patient.email?.toLowerCase().includes(lowercaseQuery)
    );
  };

  // ✅ Get statistics
  const getPatientStats = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today.setDate(today.getDate() - 7));
    
    return {
      total: patients.length,
      male: patients.filter(p => p.gender === "Male").length,
      female: patients.filter(p => p.gender === "Female").length,
      other: patients.filter(p => p.gender === "Other").length,
      newThisWeek: patients.filter(p => {
        const regDate = new Date(p.registeredDate);
        return regDate >= oneWeekAgo;
      }).length,
    };
  };

  return (
    <PatientsContext.Provider value={{ 
      patients, 
      addPatient, 
      updatePatient, 
      deletePatient,
      getPatientById,
      searchPatients,
      getPatientStats
    }}>
      {children}
    </PatientsContext.Provider>
  );
};

// ✅ Custom hook
export const usePatients = () => {
  const context = useContext(PatientsContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientsProvider');
  }
  return context;
};

export default PatientsContext;