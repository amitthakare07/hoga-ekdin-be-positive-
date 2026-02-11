import React, { useState, useEffect } from "react";
// ==================== REACT ROUTER DOM ====================
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "./ReceptionistDashboard.css";

// ==================== RECEPTIONIST DASHBOARD ====================
// Main layout component for receptionist area with sidebar navigation

function ReceptionistDashboard() {
  // ==================== STATE ====================
  const [activePage, setActivePage] = useState("dashboard");
  
  // ==================== HOOKS ====================
  const navigate = useNavigate();
  const location = useLocation();

  // ==================== SYNC ACTIVE PAGE WITH URL ====================
  useEffect(() => {
    // Get current path and set active page
    const path = location.pathname;
    if (path === "/receptionist-dashboard" || path === "/receptionist-dashboard/") {
      setActivePage("dashboard");
    } else {
      // Extract page ID from path (e.g., /receptionist-dashboard/appointments -> appointments)
      const pageId = path.split("/").pop();
      setActivePage(pageId);
    }
  }, [location]);

  // ==================== SIDEBAR ITEMS ====================
  const mainMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠", path: "/receptionist-dashboard" },
  ];

  const peopleMenuItems = [
    { id: "patients", label: "Patients", icon: "👥", path: "/receptionist-dashboard/patients" },
    { id: "admit-patients", label: "Admit Patients", icon: "🛏️", path: "/receptionist-dashboard/admit-patients" },
    { id: "doctors", label: "Doctors", icon: "👨‍⚕️", path: "/receptionist-dashboard/doctors" },
  ];

  const medicalMenuItems = [
    { id: "appointments", label: "Appointments", icon: "📅", path: "/receptionist-dashboard/appointments" },
    { id: "laboratory", label: "Laboratory", icon: "🔬", path: "/receptionist-dashboard/laboratory" },
    { id: "services", label: "Services", icon: "🏥", path: "/receptionist-dashboard/services" },
  ];

  // ==================== HANDLER FUNCTIONS ====================
  const handleNavigation = (path, pageId) => {
    setActivePage(pageId);
    navigate(path);
  };

  const handleLogout = () => {
    // Clear any session data if needed
    localStorage.removeItem('user'); // Example: clear user data
    sessionStorage.clear(); // Clear all session storage
    navigate("/");
  };

  // ==================== RENDER ====================
  return (
    <div className="reception-container">
      {/* ==================== SIDEBAR ==================== */}
      <div className="sidebar">
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="hospital-logo">🏥</div>
          <h2>Clinic Dashboard</h2>
          <p className="user-role">Receptionist</p>
        </div>
        
        {/* Navigation Menu */}
        <div className="sidebar-nav">
          {/* MAIN Section */}
          <div className="menu-section">
            <label className="menu-section-label">MAIN</label>
            <ul className="sidebar-menu">
              {mainMenuItems.map((item) => (
                <li
                  key={item.id}
                  className={activePage === item.id ? "active" : ""}
                  onClick={() => handleNavigation(item.path, item.id)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* PEOPLE Section */}
          <div className="menu-section">
            <label className="menu-section-label">PEOPLE</label>
            <ul className="sidebar-menu">
              {peopleMenuItems.map((item) => (
                <li
                  key={item.id}
                  className={activePage === item.id ? "active" : ""}
                  onClick={() => handleNavigation(item.path, item.id)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* MEDICAL Section */}
          <div className="menu-section">
            <label className="menu-section-label">MEDICAL</label>
            <ul className="sidebar-menu">
              {medicalMenuItems.map((item) => (
                <li
                  key={item.id}
                  className={activePage === item.id ? "active" : ""}
                  onClick={() => handleNavigation(item.path, item.id)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
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

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default ReceptionistDashboard;