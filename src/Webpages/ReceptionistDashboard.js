import React, { useState } from "react";
// ==================== REACT ROUTER DOM ====================
// useNavigate: Hook for programmatic navigation between routes
// Outlet: Component that renders the matched child route
import { useNavigate, Outlet, Link } from "react-router-dom";
import "./ReceptionistDashboard.css";


// ==================== RECEPTIONIST DASHBOARD ====================
// This is the main layout component for the receptionist area
// It contains a sidebar with navigation and a main content area
// The Outlet component renders the current page based on the route

function ReceptionistDashboard() {
  // ==================== STATE ====================
  // Stores the current active page for sidebar highlighting
  const [activePage, setActivePage] = useState("dashboard");
  
  // ==================== NAVIGATION HOOK ====================
  // Used for programmatic navigation (e.g., logout)
  const navigate = useNavigate();

  // ==================== SIDEBAR ITEMS ====================
  // Array of sidebar menu items with their properties
  // Each item has: id, label, icon, and optional sub-items
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "appointments", label: "Appointments", icon: "📅" },
  ];
  const menuItems1 = [
    { id: "patients", label: "Patients", icon: "👥" },
    { id: "admit-patients", label: "Admit Patients", icon: "🛏️" },
    { id: "doctors", label: "Doctors", icon: "👨‍⚕️" },
  ];
  const menuItems2 = [
    { id: "laboratory", label: "Laboratory", icon: "🔬" },
    { id: "services", label: "Services", icon: "🏥" },
    { id: "department", label: "Department", icon: "🏥" },
  ];
  

  // ==================== HANDLER FUNCTIONS ====================
  // Handle navigation when a sidebar item is clicked
  const handleNavigation = (pageId) => {
    setActivePage(pageId);
    navigate(`/${pageId === "dashboard" ? "receptionist-dashboard" : `receptionist-dashboard/${pageId}`}`);
  };

  // Handle logout functionality
  const handleLogout = () => {
    // Clear any stored session data here if needed
    // navigate to home page
    navigate("/");
  };

  // ==================== RENDER ====================
  return (
    <div className="reception-container">
      {/* ==================== SIDEBAR ==================== */}
      {/* Left sidebar navigation menu */}
      {/* Fixed width: 240px, background: dark blue (#0a2540) */}
      <div className="sidebar">
        {/* Sidebar header with hospital logo/name */}
        <div className="sidebar-header">
          <div className="hospital-logo">🏥</div>
          <h2>Clinic Dashboard</h2>
        </div>
        
        {/* Navigation menu */}
        {/* Uses map to render menu items dynamically */}
        <div>
        <ul className="sidebar-menu">
          <label className="a">MAIN</label>
          {menuItems.map((item) => (
            <li
              key={item.id}
              // Apply 'active' class if this item is currently selected
              className={activePage === item.id ? "active" : ""}
              // On click, navigate to the corresponding page
              onClick={() => handleNavigation(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </li>
          ))}
        </ul>

        <ul className="sidebar-menu1">
          <label className="ab">PEOPLE</label>
          {menuItems1.map((item) => (
            <li
              key={item.id}
              // Apply 'active' class if this item is currently selected
              className={activePage === item.id ? "active" : ""}
              // On click, navigate to the corresponding page
              onClick={() => handleNavigation(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </li>
          ))}
        </ul>

        <ul className="sidebar-menu2">
          <label className="abc">MEDICAL</label>
          {menuItems2.map((item) => (
            <li
              key={item.id}
              // Apply 'active' class if this item is currently selected
              className={activePage === item.id ? "active" : ""}
              // On click, navigate to the corresponding page
              onClick={() => handleNavigation(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </li>
          ))}
        </ul></div>

        {/* Logout button */}
        {/* Separated from main menu for visual distinction */}
        <div className="sidebar-footer">
          <li className="logout" onClick={handleLogout}>
            <span className="menu-icon">🚪</span>
            <span className="menu-label">Logout</span>
          </li>
        </div>
      </div>

      {/* ==================== MAIN CONTENT AREA ==================== */}
      {/* Right side content area that changes based on selected page */}
      {/* Uses Outlet to render the current child route component */}
      <div className="main-content">
        {/* Outlet renders:
            - DashboardHome (for /receptionist-dashboard)
            - Appointments (for /receptionist-dashboard/appointments)
            - Patients (for /receptionist-dashboard/patients)
            - AdmitPatients (for /receptionist-dashboard/admit-patients)
            - Doctors (for /receptionist-dashboard/doctors)
            - Reports (for /receptionist-dashboard/reports)
            - Services (for /receptionist-dashboard/services)
        */}
        <Outlet />
      </div>
    </div>
  );
}

// Export the component for use in App.js routing
export default ReceptionistDashboard;

