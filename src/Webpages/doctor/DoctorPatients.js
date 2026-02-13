import React, { useState } from "react";
import "../ReceptionistDashboard.css";

// ==================== DOCTOR PATIENTS PAGE ====================
// This component manages doctor's patient records and medical history
// Doctors can view patient details, medical history, and update records

function DoctorPatients() {
  // ==================== STATE ====================
  // Stores list of doctor's patients
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Doe",
      age: 45,
      gender: "Male",
      phone: "9876543210",
      email: "john@example.com",
      lastVisit: "2024-01-10",
      condition: "Hypertension",
      medications: ["Lisinopril 10mg", "Amlodipine 5mg"],
      allergies: ["Penicillin"],
      notes: "Regular follow-up required"
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      phone: "9876543211",
      email: "jane@example.com",
      lastVisit: "2024-01-08",
      condition: "Diabetes Type 2",
      medications: ["Metformin 500mg", "Insulin"],
      allergies: ["None"],
      notes: "Blood sugar monitoring"
    },
    {
      id: 3,
      name: "Mike Brown",
      age: 28,
      gender: "Male",
      phone: "9876543212",
      email: "mike@example.com",
      lastVisit: "2024-01-05",
      condition: "Asthma",
      medications: ["Albuterol inhaler"],
      allergies: ["Dust mites"],
      notes: "Seasonal triggers"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      age: 55,
      gender: "Female",
      phone: "9876543213",
      email: "sarah@example.com",
      lastVisit: "2024-01-03",
      condition: "Arthritis",
      medications: ["Ibuprofen 400mg", "Methotrexate"],
      allergies: ["Sulfa drugs"],
      notes: "Joint pain management"
    },
  ]);

  // Controls form visibility for adding new patients
  const [showForm, setShowForm] = useState(false);
  // Stores form data
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    condition: "",
    medications: "",
    allergies: "",
    notes: "",
  });

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  // Selected patient for detailed view
  const [selectedPatient, setSelectedPatient] = useState(null);

  // ==================== HANDLER FUNCTIONS ====================
  // Handle input changes in form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add new patient to the list
    const newPatient = {
      id: patients.length + 1,
      ...formData,
      lastVisit: new Date().toISOString().split("T")[0],
      medications: formData.medications.split(",").map(med => med.trim()),
      allergies: formData.allergies.split(",").map(allergy => allergy.trim()),
    };
    setPatients([...patients, newPatient]);
    // Reset form
    setFormData({
      name: "",
      age: "",
      gender: "Male",
      phone: "",
      email: "",
      condition: "",
      medications: "",
      allergies: "",
      notes: "",
    });
    setShowForm(false);
  };

  // Update patient record
  const updatePatient = (id, updatedData) => {
    setPatients(patients.map(patient =>
      patient.id === id ? { ...patient, ...updatedData } : patient
    ));
  };

  // Delete patient
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      setPatients(patients.filter((p) => p.id !== id));
    }
  };

  // Filter patients based on search
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  return (
    <div className="doctor-patients-page">
      {/* ==================== PAGE HEADER ==================== */}
      <div className="page-header">
        <h1>My Patients</h1>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add New Patient"}
        </button>
      </div>

      {/* ==================== SEARCH BAR ==================== */}
      {/* Allows doctor to search patients by name, condition, or phone */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search patients by name, condition, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* ==================== NEW PATIENT FORM ==================== */}
      {/* Hidden by default, shown when "+ Add New Patient" is clicked */}
      {showForm && (
        <div className="form-container">
          <h3>Add New Patient</h3>
          <form onSubmit={handleSubmit}>
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
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="tel"
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
                name="condition"
                placeholder="Medical Condition"
                value={formData.condition}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="medications"
                placeholder="Medications (comma separated)"
                value={formData.medications}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="allergies"
                placeholder="Allergies (comma separated)"
                value={formData.allergies}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <textarea
                name="notes"
                placeholder="Medical Notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
              />
            </div>
            <div className="form-row">
              <button type="submit" className="submit-btn">
                Save Patient
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== PATIENTS GRID ==================== */}
      {/* Displays patients in a card-based grid layout */}
      <div className="patients-grid">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="patient-card">
            <div className="patient-header">
              <div className="patient-avatar">
                {patient.name.split(" ").slice(1, 2)[0]?.charAt(0) || "P"}
              </div>
              <div className="patient-info">
                <h3>{patient.name}</h3>
                <p className="patient-details">{patient.age} years, {patient.gender}</p>
              </div>
            </div>
            <div className="patient-details">
              <div className="detail-row">
                <span className="detail-label">📧 Email:</span>
                <span className="detail-value">{patient.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📞 Phone:</span>
                <span className="detail-value">{patient.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🏥 Condition:</span>
                <span className="detail-value">{patient.condition}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">💊 Medications:</span>
                <span className="detail-value">{patient.medications.join(", ")}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">⚠️ Allergies:</span>
                <span className="detail-value">{patient.allergies.join(", ")}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📅 Last Visit:</span>
                <span className="detail-value">{patient.lastVisit}</span>
              </div>
            </div>
            <div className="patient-notes">
              <p><strong>Notes:</strong> {patient.notes}</p>
            </div>
            <div className="patient-actions">
              <button className="view-btn" onClick={() => setSelectedPatient(patient)}>
                View Full Record
              </button>
              <button className="edit-btn">Update Record</button>
              <button className="delete-btn" onClick={() => handleDelete(patient.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ==================== PATIENT DETAIL MODAL ==================== */}
      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedPatient.name}'s Medical Record</h2>
              <button className="close-btn" onClick={() => setSelectedPatient(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="record-section">
                <h3>Personal Information</h3>
                <p><strong>Age:</strong> {selectedPatient.age}</p>
                <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                <p><strong>Email:</strong> {selectedPatient.email}</p>
              </div>
              <div className="record-section">
                <h3>Medical Information</h3>
                <p><strong>Condition:</strong> {selectedPatient.condition}</p>
                <p><strong>Medications:</strong> {selectedPatient.medications.join(", ")}</p>
                <p><strong>Allergies:</strong> {selectedPatient.allergies.join(", ")}</p>
                <p><strong>Last Visit:</strong> {selectedPatient.lastVisit}</p>
              </div>
              <div className="record-section">
                <h3>Doctor's Notes</h3>
                <p>{selectedPatient.notes}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUMMARY STATISTICS ==================== */}
      {/* Shows quick statistics about patients */}
      <div className="summary-stats">
        <div className="summary-card">
          <h4>Total Patients</h4>
          <p>{patients.length}</p>
        </div>
        <div className="summary-card">
          <h4>Male</h4>
          <p>{patients.filter((p) => p.gender === "Male").length}</p>
        </div>
        <div className="summary-card">
          <h4>Female</h4>
          <p>{patients.filter((p) => p.gender === "Female").length}</p>
        </div>
        <div className="summary-card">
          <h4>Recent Visits</h4>
          <p>{patients.filter((p) => new Date(p.lastVisit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}</p>
        </div>
      </div>
    </div>
  );
}

export default DoctorPatients;
