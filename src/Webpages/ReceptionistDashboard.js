import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import "./ReceptionistDashboard.css";

function ReceptionistDashboard() {
  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const initialLoadDone = useRef(false); // Prevent multiple initial loads

  const navigate = useNavigate();

  // Log admissions whenever they change
  useEffect(() => {
    console.log("🏥 ReceptionistDashboard admissions updated:", admissions);
  }, [admissions]);

  // Safe initial data loading (runs only once)
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    // Example: load patients from localStorage (if any)
    try {
      const storedPatients = localStorage.getItem('patients');
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      }
    } catch (error) {
      console.error("Failed to load patients:", error);
    }

    // Example: load admissions from localStorage (if any) – merge, don't replace
    try {
      const storedAdmissions = localStorage.getItem('admissions');
      if (storedAdmissions) {
        const parsed = JSON.parse(storedAdmissions);
        setAdmissions(prev => {
          // Merge, avoiding duplicates (optional)
          const merged = [...prev, ...parsed];
          // Remove duplicates by id if needed
          return merged;
        });
      }
    } catch (error) {
      console.error("Failed to load admissions:", error);
    }
  }, []); // Empty dependency = runs once on mount

  // Optional: persist admissions to localStorage whenever they change
  useEffect(() => {
    if (admissions.length > 0) {
      localStorage.setItem('admissions', JSON.stringify(admissions));
    }
  }, [admissions]);

  const addAdmission = useCallback((newAdmission) => {
    console.log("➕ Adding admission (before state update):", newAdmission);
    setAdmissions(prev => {
      const updated = [...prev, { ...newAdmission, id: Date.now() }];
      console.log("✅ Updated admissions array:", updated);
      return updated;
    });
  }, []);

  const getAvailableBeds = useCallback(() => {
    const totalBeds = 20;
    const isActive = (admission) => {
      if (!admission.toDate) return true;
      const today = new Date();
      today.setHours(0,0,0,0);
      const discharge = new Date(admission.toDate);
      discharge.setHours(0,0,0,0);
      return discharge >= today;
    };
    const occupiedBeds = admissions.filter(isActive).map(adm => adm.bedNo);
    const allBeds = Array.from({ length: totalBeds }, (_, i) => `B${i + 1}`);
    return allBeds.filter(bed => !occupiedBeds.includes(bed));
  }, [admissions]);

  const searchPatients = useCallback((query) => {
    return patients.filter(p => 
      p.patientName.toLowerCase().includes(query.toLowerCase())
    );
  }, [patients]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.clear();
    navigate("/");
  };

  // Sidebar menu items (unchanged)
  const mainMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠", path: "/receptionist-dashboard" },
  ];

  const peopleMenuItems = [
    { id: "patients", label: "Patients", icon: "👥", path: "/receptionist-dashboard/patients" },
    { id: "admit-patient", label: "Admit Patient", icon: "🛏️", path: "/receptionist-dashboard/admit-patient" },
    { id: "bedview", label: "Bed View", icon: "📊", path: "/receptionist-dashboard/bedview" },
    { id: "doctors", label: "Doctors", icon: "👨‍⚕️", path: "/receptionist-dashboard/doctors" },
  ];

  const medicalMenuItems = [
    { id: "appointments", label: "Appointments", icon: "📅", path: "/receptionist-dashboard/appointments" },
    { id: "laboratory", label: "Laboratory", icon: "🔬", path: "/receptionist-dashboard/laboratory" },
    { id: "services", label: "Services", icon: "🏥", path: "/receptionist-dashboard/services" },
  ];

  return (
    <div className="reception-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="hospital-logo">🏥</div>
          <h2>Clinic Dashboard</h2>
          <p className="user-role">Receptionist</p>
        </div>

        <div className="sidebar-nav">
          {/* MAIN Section */}
          <div className="menu-section">
            <label className="menu-section-label">MAIN</label>
            <ul className="sidebar-menu">
              {mainMenuItems.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => isActive ? "active" : ""}
                    end={item.path === "/receptionist-dashboard"}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-label">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* PEOPLE Section */}
          <div className="menu-section">
            <label className="menu-section-label">PEOPLE</label>
            <ul className="sidebar-menu">
              {peopleMenuItems.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => isActive ? "active" : ""}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-label">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* MEDICAL Section */}
          <div className="menu-section">
            <label className="menu-section-label">MEDICAL</label>
            <ul className="sidebar-menu">
              {medicalMenuItems.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => isActive ? "active" : ""}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-label">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <li className="logout" onClick={handleLogout}>
            <span className="menu-icon">🚪</span>
            <span className="menu-label">Logout</span>
          </li>
        </div>
      </div>

      {/* Main content with context */}
      <div className="main-content">
        <Outlet
          context={{ admissions, addAdmission, getAvailableBeds, patients, searchPatients }}
        />
      </div>
    </div>
  );
}

export default ReceptionistDashboard;