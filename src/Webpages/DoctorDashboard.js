import React, { useState } from "react";
// ==================== REACT ROUTER DOM ====================
// useNavigate: Hook for programmatic navigation between routes
// Outlet: Component that renders the matched child route
import { useNavigate, Outlet, Link } from "react-router-dom";
import "./DoctorDashboard.css";

// ==================== DOCTOR DASHBOARD ====================
// This is the main layout component for the doctor area
// It contains a sidebar with navigation and a main content area
// The Outlet component renders the current page based on the route

function DoctorDashboard() {
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
    { id: "appointments", label: "My Appointments", icon: "📅" },
    { id: "patients", label: "My Patients", icon: "👥" },
    { id: "profile", label: "My Profile", icon: "👨‍⚕️" },
  ];

  // ==================== HANDLER FUNCTIONS ====================
  // Handle navigation when a sidebar item is clicked
  const handleNavigation = (pageId) => {
    setActivePage(pageId);
    navigate(`/doctor-dashboard/${pageId === "dashboard" ? "" : pageId}`);
  };

  // Handle logout functionality
  const handleLogout = () => {
    // Clear any stored session data here if needed
    // navigate to home page
    navigate("/");
  };

  // ==================== RENDER ====================
  return (
    <div className="doctor-container">
      {/* ==================== SIDEBAR ==================== */}
      {/* Left sidebar navigation menu */}
      {/* Fixed width: 240px, background: blue gradient (#1f3c88 to #2d5a87) */}
      <div className="sidebar">
        {/* Sidebar header with hospital logo/name */}
        <div className="sidebar-header">
          <div className="hospital-logo">🏥</div>
          <h2>MediCare Hospital</h2>
          <p className="doctor-name">Dr. Pranjal Patil</p>
        </div>

        {/* Navigation menu */}
        {/* Uses map to render menu items dynamically */}
        <ul className="sidebar-menu">
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
            - DoctorDashboardHome (for /doctor-dashboard)
            - DoctorAppointments (for /doctor-dashboard/appointments)
            - DoctorPatients (for /doctor-dashboard/patients)
            - DoctorProfile (for /doctor-dashboard/profile)
        */}
        <Outlet />
      </div>
    </div>
  );
}

// Export the component for use in App.js routing
export default DoctorDashboard;
