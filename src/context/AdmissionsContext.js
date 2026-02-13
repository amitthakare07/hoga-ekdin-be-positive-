import React, { createContext, useContext, useState, useEffect } from "react";

const AdmissionsContext = createContext();

export const AdmissionsProvider = ({ children }) => {
  const [admissions, setAdmissions] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedAdmissions = localStorage.getItem('admissions');
    if (savedAdmissions) {
      try {
        const parsed = JSON.parse(savedAdmissions);
        if (Array.isArray(parsed)) {
          setAdmissions(parsed);
        }
      } catch (error) {
        console.error('Error loading admissions:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('admissions', JSON.stringify(admissions));
  }, [admissions]);

  // Generate unique ID
  const generateId = () => {
    return `ADM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // Add admission
  const addAdmission = (admissionData) => {
    const newAdmission = {
      id: generateId(),
      ...admissionData,
      status: admissionData.status || "Admitted",
      admissionDate: admissionData.admissionDate || new Date().toISOString().split('T')[0],
      admissionTime: admissionData.admissionTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    setAdmissions(prev => [...prev, newAdmission]);
    return newAdmission;
  };

  // Update admission
  const updateAdmission = (id, updatedData) => {
    setAdmissions(prev => 
      prev.map(adm => 
        adm.id === id ? { ...adm, ...updatedData } : adm
      )
    );
  };

  // Discharge patient
  const dischargePatient = (id) => {
    setAdmissions(prev => 
      prev.map(adm => 
        adm.id === id 
          ? { 
              ...adm, 
              status: "Discharged", 
              dischargeDate: new Date().toISOString().split('T')[0],
              dischargeTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
            } 
          : adm
      )
    );
  };

  // Get available beds
  const getAvailableBeds = (allBeds) => {
    const occupiedBeds = admissions
      .filter(adm => adm.status === "Admitted")
      .map(adm => adm.bedNo);
    return allBeds.filter(bed => !occupiedBeds.includes(bed));
  };

  return (
    <AdmissionsContext.Provider value={{ 
      admissions, 
      addAdmission, 
      updateAdmission,
      dischargePatient,
      getAvailableBeds 
    }}>
      {children}
    </AdmissionsContext.Provider>
  );
};

export const useAdmissions = () => {
  const context = useContext(AdmissionsContext);
  if (!context) {
    throw new Error('useAdmissions must be used within an AdmissionsProvider');
  }
  return context;
};

export default AdmissionsContext;