import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentForm from "./AppointmentForm";           // ✅ Direct import from same folder
import PatientRegistrationForm from "./PatientRegistrationForm"; // ✅ Direct import from same folder
import AdmitPatientForm from "./AdmitPatientForm";        // ✅ Direct import from same folder
import "./DashboardHome.css";

function DashboardHome() {
  const navigate = useNavigate();
  
  // ==================== STATES ====================
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");

  // Available bed numbers
  const availableBeds = [
    "101", "102", "103", "104", "105",
    "201", "202", "203", "204", "205",
    "301", "302", "303", "304", "305",
    "ICU-1", "ICU-2", "ICU-3", "ICU-4", "ICU-5",
  ];

  // ==================== LOAD DATA FROM LOCALSTORAGE ====================
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
    
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) setPatients(JSON.parse(savedPatients));
    
    const savedAdmissions = localStorage.getItem('admissions');
    if (savedAdmissions) setAdmissions(JSON.parse(savedAdmissions));
  }, []);

  // ==================== SAVE DATA TO LOCALSTORAGE ====================
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('admissions', JSON.stringify(admissions));
  }, [admissions]);

  // ==================== APPOINTMENT FUNCTIONS ====================
  const addAppointment = (appointment) => {
    const newAppointment = {
      id: `APT-${Date.now()}`,
      ...appointment,
      status: appointment.status || "Pending"
    };
    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  const updateAppointment = (id, updatedData) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, ...updatedData } : apt));
  };

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const getTodaysAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === today);
  };

  // ==================== PATIENT FUNCTIONS ====================
  const addPatient = (patient) => {
    const newPatient = { 
      id: `PAT-${Date.now()}`, 
      ...patient,
      registeredDate: new Date().toISOString().split('T')[0],
      registeredTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  };

  const updatePatient = (id, updatedData) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deletePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const searchPatients = (query) => {
    if (!query) return [];
    return patients.filter(p => 
      p.patientName?.toLowerCase().includes(query.toLowerCase()) ||
      p.phone?.includes(query) ||
      p.email?.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getPatientById = (id) => {
    return patients.find(p => p.id === id);
  };

  // ==================== ADMISSION FUNCTIONS ====================
  const addAdmission = (admission) => {
    const newAdmission = { 
      id: `ADM-${Date.now()}`, 
      ...admission,
      admissionDate: new Date().toISOString().split('T')[0],
      admissionTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      status: "Admitted"
    };
    setAdmissions(prev => [...prev, newAdmission]);
    return newAdmission;
  };

  const updateAdmission = (id, updatedData) => {
    setAdmissions(prev => prev.map(adm => adm.id === id ? { ...adm, ...updatedData } : adm));
  };

  const dischargePatient = (id) => {
    setAdmissions(prev => prev.map(adm => 
      adm.id === id ? { 
        ...adm, 
        status: "Discharged", 
        dischargeDate: new Date().toISOString().split('T')[0] 
      } : adm
    ));
  };

  const getAvailableBeds = () => {
    const occupied = admissions.filter(adm => adm.status === "Admitted").map(adm => adm.bedNo);
    return availableBeds.filter(bed => !occupied.includes(bed));
  };

  const getAdmittedPatients = () => {
    return admissions.filter(adm => adm.status === "Admitted");
  };

  // ==================== POPUP HANDLERS ====================
  const openPopup = (type) => {
    setPopupType(type);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupType("");
  };

  // ==================== STATISTICS ====================
  const stats = [
    { label: "Total Appointments", value: appointments?.length || 0, icon: "📅", color: "#1976d2" },
    { label: "Today's Appointments", value: getTodaysAppointments().length, icon: "🗓️", color: "#388e3c" },
    { label: "Registered Patients", value: patients?.length || 0, icon: "👥", color: "#f57c00" },
    { label: "Admitted Patients", value: getAdmittedPatients().length, icon: "🛏️", color: "#d32f2f" },
    { label: "Available Beds", value: getAvailableBeds().length, icon: "🛏️", color: "#2e7d32" }
  ];

  // Recent activities
  const recentActivities = [
    ...(appointments?.slice(-3).map(apt => ({
      time: `${apt.date} ${apt.time}`,
      activity: `Appointment booked for ${apt.patientName}`,
      type: "appointment"
    })) || []),
    ...(patients?.slice(-3).map(pat => ({
      time: `${pat.registeredDate} ${pat.registeredTime}`,
      activity: `New patient registered: ${pat.patientName}`,
      type: "registration"
    })) || []),
    ...(admissions?.slice(-3).map(adm => ({
      time: `${adm.admissionDate} ${adm.admissionTime}`,
      activity: `Patient admitted: ${adm.patientName} (Bed ${adm.bedNo})`,
      type: "admission"
    })) || [])
  ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5);

  return (
    <div className="dashboard-home">
      {/* ==================== PAGE HEADER ==================== */}
      <div className="dashboard-header">
        <h1>Welcome to Reception Dashboard</h1>
        <p className="subtitle">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>

      {/* ==================== STATISTICS CARDS ==================== */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ==================== QUICK ACTIONS ==================== */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => openPopup("appointment")}>
            <span className="action-icon">📅</span>
            <span>Book Appointment</span>
          </button>
          <button className="action-btn" onClick={() => openPopup("patient")}>
            <span className="action-icon">➕</span>
            <span>Add New Patient</span>
          </button>
          <button className="action-btn" onClick={() => openPopup("admit")}>
            <span className="action-icon">🏥</span>
            <span>Admit Patient</span>
          </button>
          <button className="action-btn" onClick={() => navigate("/receptionist-dashboard/doctors")}>
            <span className="action-icon">👨‍⚕️</span>
            <span>Doctors</span>
          </button>
        </div>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => navigate("/receptionist-dashboard/appointments")}>
            <span className="action-icon">📋</span>
            <span>Appointment List</span>
          </button>
          <button className="action-btn" onClick={() => navigate("/receptionist-dashboard/patients")}>
            <span className="action-icon">👥</span>
            <span>All Patient List</span>
          </button>
          <button className="action-btn" onClick={() => navigate("/receptionist-dashboard/admit-patients")}>
            <span className="action-icon">🛏️</span>
            <span>Admitted List</span>
          </button>
          <button className="action-btn" onClick={() => navigate("/receptionist-dashboard/laboratory")}>
            <span className="action-icon">🔬</span>
            <span>Laboratory</span>
          </button>
        </div>
      </div>

      {/* ==================== RECENT ACTIVITIES ==================== */}
      <div className="recent-activities-section">
        <h2>Recent Activities</h2>
        <div className="activities-list">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <span className="activity-time">{activity.time}</span>
                <span className="activity-text">{activity.activity}</span>
                <span className={`activity-type ${activity.type}`}>{activity.type}</span>
              </div>
            ))
          ) : (
            <div className="no-activities">
              <p>No recent activities</p>
            </div>
          )}
        </div>
      </div>

      {/* ==================== FORMS ==================== */}
      {showPopup && popupType === "appointment" && (
        <AppointmentForm 
          onClose={closePopup}
          addAppointment={addAppointment}
          appointments={appointments}
        />
      )}

      {showPopup && popupType === "patient" && (
        <PatientRegistrationForm 
          onClose={closePopup}
          addPatient={addPatient}
          patients={patients}
        />
      )}

      {showPopup && popupType === "admit" && (
        <AdmitPatientForm
          onClose={closePopup}
          addAdmission={addAdmission}
          searchPatients={searchPatients}
          getAvailableBeds={getAvailableBeds}
          availableBeds={availableBeds}
        />
      )}
    </div>
  );
}

export default DashboardHome;