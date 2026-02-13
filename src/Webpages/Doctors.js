import React, { useState } from "react";
import "./Doctor.css";
// ==================== DOCTORS PAGE ====================
// This component manages doctor information and schedules
// Receptionists can view doctor details and availability

function Doctors() {
  // ==================== STATE ====================
  // Stores list of doctors
  const [doctors] = useState([
    { id: 1, name: "Dr. Pranjal Patil", specialization: "Cardiology", department: "Cardiology", phone: "9876543210", email: "pranjal@gmail.com", availability: "Mon-Sat", status: "Available" },
  ]);

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");

  // ==================== HELPER FUNCTIONS ====================
  // Get unique departments for filter dropdown
  const departments = ["All", ...new Set(doctors.map((d) => d.department))];

  // Filter doctors based on search and department
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="doctors-page">
      {/* ==================== PAGE HEADER ==================== */}
      <div className="page-header">
        <h1>Our Doctors</h1>
        <button className="add-btn">+ Add New Doctor</button>
      </div>

      <div className="summary-stats">
        <div className="summary-card">
          <h4>Total Doctors</h4>
          <p>{doctors.length}</p>
        </div>
        <div className="summary-card">
          <h4>Available Today</h4>
          <p>{doctors.filter((d) => d.status === "Available").length}</p>
        </div>
        <div className="summary-card">
          <h4>On Leave</h4>
          <p>{doctors.filter((d) => d.status === "On Leave").length}</p>
        </div>
        <div className="summary-card">
          <h4>Departments</h4>
          <p>{departments.length - 1}</p>
        </div>
      </div><br></br>

      {/* ==================== SEARCH AND FILTER ==================== */}
      {/* Allows receptionist to search doctors and filter by department */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search doctors by name, specialization, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* ==================== DOCTORS GRID ==================== */}
      {/* Displays doctor cards in a responsive grid layout */}
      <div className="doctors-grid">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <div className="doctor-header">
              <div className="doctor-avatar">
                {doctor.name.split(" ").slice(1, 2)[0]?.charAt(0) || "D"}
              </div>
              <div className="doctor-info">
                <h3>{doctor.name}</h3>
                <p className="specialization">{doctor.specialization}</p>
              </div>
              <span className={`status-indicator ${doctor.status.toLowerCase().replace(" ", "-")}`}>
                {doctor.status}
              </span>
            </div>
            <div className="doctor-details">
              <div className="detail-row">
                <span className="detail-label">Department:</span>
                <span className="detail-value">{doctor.department}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Availability:</span>
                <span className="detail-value">{doctor.availability}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{doctor.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{doctor.email}</span>
              </div>
            </div>
            <div className="doctor-actions">
              <button className="edit-btn">Edit</button>
            </div>
          </div>
        ))}
      </div>

      {/* ==================== SUMMARY STATISTICS ==================== */}
      {/* Shows quick statistics about doctors */}

    </div>
  );
}

export default Doctors;

