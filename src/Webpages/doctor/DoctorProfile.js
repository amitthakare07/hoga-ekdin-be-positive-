import React, { useState } from "react";
import "../ReceptionistDashboard.css";
import "./DoctorProfile.css";

// ==================== DOCTOR PROFILE PAGE ====================
// This component manages doctor's personal information and settings
// Doctors can view and edit their profile details

function DoctorProfile() {
  // ==================== STATE ====================
  // Stores doctor's profile information
  const [doctorInfo, setDoctorInfo] = useState({
    name: "Dr. Pranjal Patil",
    specialization: "Cardiology",
    department: "Cardiology",
    phone: "9876543210",
    email: "pranjal.patil@hospital.com",
    address: "123 Medical Center, Nashik, Maharashtra",
    experience: "8 years",
    licenseNumber: "MH123456789",
    qualifications: "MBBS, MD Cardiology",
    joinDate: "2016-03-15",
  });

  // Controls edit mode
  const [isEditing, setIsEditing] = useState(false);
  // Stores form data during editing
  const [formData, setFormData] = useState({ ...doctorInfo });

  // ==================== HANDLER FUNCTIONS ====================
  // Handle input changes in edit form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setDoctorInfo(formData);
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({ ...doctorInfo });
    setIsEditing(false);
  };

  return (
    <div className="doctor-profile-page">
      {/* ==================== PAGE HEADER ==================== */}
      <div className="page-header">
        <h1>My Profile</h1>
        {!isEditing && (
          <button className="add-btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      {/* ==================== PROFILE CONTENT ==================== */}
      {!isEditing ? (
        // ==================== VIEW MODE ====================
        <div className="profile-content">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="doctor-avatar-large">
              {doctorInfo.name.split(" ").slice(1, 2)[0]?.charAt(0) || "D"}
            </div>
            <div className="doctor-info-large">
              <h2>{doctorInfo.name}</h2>
              <p className="specialization">{doctorInfo.specialization}</p>
              <p className="department">{doctorInfo.department} Department</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="profile-details">
            <div className="detail-section">
              <h3>Personal Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Full Name:</label>
                  <span>{doctorInfo.name}</span>
                </div>
                <div className="detail-item">
                  <label>Phone:</label>
                  <span>{doctorInfo.phone}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{doctorInfo.email}</span>
                </div>
                <div className="detail-item">
                  <label>Address:</label>
                  <span>{doctorInfo.address}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Professional Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Specialization:</label>
                  <span>{doctorInfo.specialization}</span>
                </div>
                <div className="detail-item">
                  <label>Department:</label>
                  <span>{doctorInfo.department}</span>
                </div>
                <div className="detail-item">
                  <label>Experience:</label>
                  <span>{doctorInfo.experience}</span>
                </div>
                <div className="detail-item">
                  <label>Join Date:</label>
                  <span>{new Date(doctorInfo.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <label>License Number:</label>
                  <span>{doctorInfo.licenseNumber}</span>
                </div>
                <div className="detail-item">
                  <label>Qualifications:</label>
                  <span>{doctorInfo.qualifications}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ==================== EDIT MODE ====================
        <div className="profile-edit-form">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Professional Information</h3>
              <div className="form-row">
                <input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="experience"
                  placeholder="Experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="licenseNumber"
                  placeholder="License Number"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="qualifications"
                  placeholder="Qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  required
                />
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Save Changes
              </button>
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default DoctorProfile;
