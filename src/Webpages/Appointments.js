import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppointments } from "../context/AppointmentsContext";
import "./ReceptionistDashboard.css";

function Appointments() {
  const navigate = useNavigate();
  const { appointments, updateAppointment, deleteAppointment, getAppointmentStats } = useAppointments();
  
  // ==================== STATE ====================
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0, pending: 0, doctor: 0, completed: 0, cancelled: 0
  });

  // ✅ DEBUG - Log appointments when component mounts and updates
  useEffect(() => {
    console.log("📋 Appointments component - Current appointments:", appointments);
    if (appointments && appointments.length > 0) {
      console.log("✅ Appointments found:", appointments.length);
    } else {
      console.log("⚠️ No appointments found");
    }
  }, [appointments]);

  // ✅ Update statistics
  useEffect(() => {
    if (appointments) {
      const statsData = getAppointmentStats();
      setStats(statsData);
    }
  }, [appointments, getAppointmentStats]);

  // ==================== FORM STATE ====================
  const [formData, setFormData] = useState({
    patientName: "", age: "", gender: "", phone: "", symptoms: [],
    date: "", time: "", type: "Cardiology", doctor: "Dr.Pranjal Patil", notes: "", status: "Pending"
  });

  // ==================== HELPER FUNCTIONS ====================
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // ==================== HANDLERS ====================
  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setShowViewPopup(true);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    const symptomsArray = appointment.symptoms 
      ? appointment.symptoms.split(", ").filter(s => s) : [];
    
    setFormData({
      patientName: appointment.patientName || "",
      age: appointment.age || "",
      gender: appointment.gender || "",
      phone: appointment.phone || "",
      symptoms: symptomsArray,
      date: appointment.date || "",
      time: appointment.time || "",
      type: appointment.type || "Cardiology",
      doctor: "Dr.Pranjal Patil",
      notes: appointment.notes || "",
      status: appointment.status || "Pending"
    });
    setShowEditPopup(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateAppointment(selectedAppointment.id, {
      ...formData,
      symptoms: formData.symptoms.join(", "),
    });
    alert("✅ Appointment updated successfully!");
    setShowEditPopup(false);
    setSelectedAppointment(null);
  };

  const handleCancel = (id) => {
    if (window.doctor("Cancel this appointment?")) {
      updateAppointment(id, { status: "Cancelled" });
      alert("✅ Appointment cancelled!");
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateAppointment(id, { status: newStatus });
  };

  // ✅ FIXED: Filter appointments - Show ALL appointments, no date restriction
  const filteredAppointments = appointments?.filter(
    (apt) => {
      if (!apt) return false;
      if (!searchTerm) return true;
      return (
        apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (apt.phone && apt.phone.includes(searchTerm)) ||
        (apt.doctor && apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  ) || [];

  // ✅ Sort by date (newest first)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date || '2024-01-01'} ${a.time || '00:00'}`);
    const dateB = new Date(`${b.date || '2024-01-01'} ${b.time || '00:00'}`);
    return dateB - dateA;
  });

  return (
    <div className="appointments-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>📋 Appointment Management</h1>
          <p className="page-subtitle">Total Appointments: {appointments?.length || 0}</p>
        </div>
        <button className="add-btn" onClick={() => navigate("/receptionist-dashboard")}>
          + Book New Appointment
        </button>
      </div>

      {/* STATISTICS */}
      <div className="summary-stats">
        <div className="summary-card">
          <div className="summary-icon">📅</div>
          <div className="summary-info">
            <h4>Total</h4>
            <p>{stats.total}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">⏳</div>
          <div className="summary-info">
            <h4>Pending</h4>
            <p>{stats.pending}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">✅</div>
          <div className="summary-info">
            <h4>Doctor</h4>
            <p>{stats.doctor}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">✔️</div>
          <div className="summary-info">
            <h4>Completed</h4>
            <p>{stats.completed}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">❌</div>
          <div className="summary-info">
            <h4>Cancelled</h4>
            <p>{stats.cancelled}</p>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-container">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by patient name, mobile, or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>×</button>
          )}
        </div>
        <div className="filter-badge">
          {sortedAppointments.length} of {appointments?.length || 0} appointment(s)
        </div>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Age/Gender</th>
              <th>Contact</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAppointments.length > 0 ? (
              sortedAppointments.map((apt) => (
                <tr key={apt.id} className={apt.status === "Cancelled" ? "cancelled-row" : ""}>
                  <td>#{apt.id?.slice(-6) || apt.id}</td>
                  <td><strong>{apt.patientName}</strong></td>
                  <td>{apt.age || "-"}/{apt.gender || "-"}</td>
                  <td>{apt.phone || "-"}</td>
                  <td>{apt.doctor || "-"}</td>
                  <td>{formatDateForDisplay(apt.date)}</td>
                  <td>{apt.time}</td>
                  <td>
                    <select
                      value={apt.status}
                      onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                      className={`status-select ${apt.status?.toLowerCase() || 'pending'}`}
                      disabled={apt.status === "Cancelled" || apt.status === "Completed"}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-btn" onClick={() => handleView(apt)} title="View">👁️</button>
                      <button className="edit-btn" onClick={() => handleEdit(apt)} title="Edit"
                        disabled={apt.status === "Cancelled" || apt.status === "Completed"}>✏️</button>
                      {apt.status !== "Cancelled" && apt.status !== "Completed" && (
                        <button className="delete-btn" onClick={() => handleCancel(apt.id)} title="Cancel">❌</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  <div className="no-data-message">
                    <span className="no-data-icon">📅</span>
                    <p>No appointments found</p>
                    <button className="add-btn-small" onClick={() => navigate("/receptionist-dashboard")}>
                      Book Your First Appointment
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW POPUP */}
      {showViewPopup && selectedAppointment && (
        <div className="popup-overlay" onClick={() => setShowViewPopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h3>Appointment Details</h3>
            <div className="popup-content">
              <p><strong>ID:</strong> {selectedAppointment.id}</p>
              <p><strong>Patient:</strong> {selectedAppointment.patientName}</p>
              <p><strong>Age/Gender:</strong> {selectedAppointment.age}/{selectedAppointment.gender}</p>
              <p><strong>Phone:</strong> {selectedAppointment.phone}</p>
              <p><strong>Doctor:</strong> {selectedAppointment.doctor}</p>
              <p><strong>Date:</strong> {formatDateForDisplay(selectedAppointment.date)}</p>
              <p><strong>Time:</strong> {selectedAppointment.time}</p>
              <p><strong>Status:</strong> {selectedAppointment.status}</p>
              <p><strong>Symptoms:</strong> {selectedAppointment.symptoms || "-"}</p>
              {selectedAppointment.notes && <p><strong>Notes:</strong> {selectedAppointment.notes}</p>}
            </div>
            <button className="cancel-btn" onClick={() => setShowViewPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* ============ EDIT POPUP - SIRF YEH ADD KIYA HAI ============ */}
      {showEditPopup && selectedAppointment && (
        <div className="popup-overlay" onClick={() => setShowEditPopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h3>✏️ Edit Appointment</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="popup-content">
                {/* Doctor Field - Fixed */}
                <p><strong>Doctor:</strong> Dr. Pranjal Patil</p>
                
                {/* Patient Name */}
                <div className="form-group">
                  <label>Patient Name *</label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    required
                  />
                </div>

                {/* Age and Gender */}
                <div style={{display: 'flex', gap: '10px'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>

                {/* Date and Time */}
                <div style={{display: 'flex', gap: '10px'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Time *</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Symptoms */}
                <div className="form-group">
                  <label>Symptoms</label>
                  <input
                    type="text"
                    value={formData.symptoms.join(", ")}
                    onChange={(e) => setFormData({
                      ...formData, 
                      symptoms: e.target.value.split(",").map(s => s.trim()).filter(s => s)
                    })}
                    placeholder="e.g. Fever, Cough, Headache"
                  />
                </div>

                {/* Status */}
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Notes */}
                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="2"
                  />
                </div>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
                <button type="button" className="cancel-btn" onClick={() => setShowEditPopup(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" style={{background: '#4CAF50', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;