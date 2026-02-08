import React, { useState } from "react";
import { useAppointments } from "../context/AppointmentsContext";

function Appointments() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  
  const [showBookForm, setShowBookForm] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [formData, setFormData] = useState({
    patientName: "",
    symptoms: [],
    date: "",
    time: "",
    status: "Pending",
    type: "Cardiology",
  });

  // Cardiology symptoms for checkboxes
  const cardiologySymptoms = [
    "Chest Pain",
    "Shortness of Breath",
    "Palpitations",
    "High Blood Pressure",
    "Dizziness",
    "Fatigue",
    "Swelling in Legs",
    "Irregular Heartbeat"
  ];

  // Indian names for autocomplete suggestions
  const indianNames = [
    "Aarav Patel", "Aanya Sharma", "Aditya Kumar", "Ananya Gupta", "Arjun Singh",
    "Diya Reddy", "Ishaan Mehta", "Kavya Nair", "Lakshya Jain", "Maya Joshi",
    "Neha Verma", "Ojas Kulkarni", "Priya Chatterjee", "Rahul Mishra", "Riya Desai",
    "Sahil Khanna", "Tanvi Pandey", "Vihaan Rao", "Yashika Iyer", "Zara Malik",
    "Amitabh Sharma", "Bharti Devi", "Chetan Bhat", "Disha Kapoor", "Eshan Gupta",
    "Fatima Begum", "Gaurav Singh", "Hema Malini", "Irfaan Khan", "Jaya Prakash",
    "Kiran Bedi", "Lalitha Devi", "Mohit Agarwal", "Nisha Reddy", "Om Prakash",
    "Pooja Sharma", "Quasar Ahmed", "Rajesh Kumar", "Sonia Gandhi", "Tarun Das",
    "Usha Devi", "Varun Sharma", "Waseem Ali", "Xena Kaur", "Yogesh Pandey",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSymptomCheckboxChange = (symptom) => {
    const currentSymptoms = formData.symptoms;
    if (currentSymptoms.includes(symptom)) {
      setFormData({
        ...formData,
        symptoms: currentSymptoms.filter(s => s !== symptom),
      });
    } else {
      setFormData({
        ...formData,
        symptoms: [...currentSymptoms, symptom],
      });
    }
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();
    const appointmentData = {
      ...formData,
      symptoms: formData.symptoms.join(", "),
    };
    addAppointment(appointmentData);
    resetForm();
    setShowBookForm(false);
    alert("Appointment booked successfully!");
  };

  const handleBookFormOpen = () => {
    resetForm();
    setShowBookForm(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateAppointment(selectedAppointment.id, {
      ...formData,
      symptoms: formData.symptoms.join(", "),
    });
    setShowEditPopup(false);
    setSelectedAppointment(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      patientName: "",
      symptoms: [],
      date: "",
      time: "",
      status: "Pending",
      type: "Cardiology",
    });
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    const symptomsArray = appointment.symptoms 
      ? appointment.symptoms.split(", ").filter(s => s)
      : [];
    setFormData({
      patientName: appointment.patientName,
      symptoms: symptomsArray,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      type: appointment.type || "Cardiology",
    });
    setShowEditPopup(true);
  };

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      deleteAppointment(id);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="appointments-page">
      <div className="page-header">
        <h1>Appointment List</h1>
        <button className="add-btn" onClick={handleBookFormOpen}>
          + Book Appointment
        </button>
      </div>

      <div className="summary-stats">
        <div className="summary-card">
          <h4>Total Appointments</h4>
          <p>{appointments.length}</p>
        </div>
        <div className="summary-card">
          <h4>Confirmed</h4>
          <p>{appointments.filter((a) => a.status === "Confirmed").length}</p>
        </div>
        <div className="summary-card">
          <h4>Pending</h4>
          <p>{appointments.filter((a) => a.status === "Pending").length}</p>
        </div>
        <div className="summary-card">
          <h4>Completed</h4>
          <p>{appointments.filter((a) => a.status === "Completed").length}</p>
        </div>
      </div>

      {showBookForm && (
        <div className="booking-form-container">
          <div className="booking-form-card form-with-spacing">
            <div className="form-header">
              <h3>Book New Appointment</h3>
              <button className="close-btn" onClick={() => setShowBookForm(false)}>×</button>
            </div>
            <form onSubmit={handleBookSubmit}>
              <div className="form-section">
                <h4>Patient Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Patient Name *</label>
                    <input
                      type="text"
                      name="patientName"
                      placeholder="Enter patient name"
                      value={formData.patientName}
                      onChange={handleChange}
                      list="indian-names"
                      required
                    />
                    <datalist id="indian-names">
                      {indianNames.map((name, index) => (
                        <option key={index} value={name} />
                      ))}
                    </datalist>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Symptoms (Select all that apply)</label>
                    <div className="symptoms-checkbox-grid">
                      {cardiologySymptoms.map((symptom) => (
                        <label key={symptom} className="symptom-checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.symptoms.includes(symptom)}
                            onChange={() => handleSymptomCheckboxChange(symptom)}
                          />
                          <span>{symptom}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Appointment Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      name="date"
                      min={getMinDate()}
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time *</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Appointment Type</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                      <option value="Cardiology">Cardiology</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowBookForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="confirm-btn">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr className="table-header-row">
              <th>ID</th>
              <th>Patient Name</th>
              <th>Type</th>
              <th>Symptoms</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id}>
                <td>#{apt.id}</td>
                <td>{apt.patientName}</td>
                <td>{apt.type || "Cardiology"}</td>
                <td>{apt.symptoms || "-"}</td>
                <td>{apt.date}</td>
                <td>{apt.time}</td>
                <td>
                  <select
                    value={apt.status}
                    onChange={(e) => updateAppointment(apt.id, { status: e.target.value })}
                    className={`status-select ${apt.status.toLowerCase()}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(apt)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleCancel(apt.id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditPopup && selectedAppointment && (
        <div className="booking-form-container" onClick={() => setShowEditPopup(false)}>
          <div className="booking-form-card form-with-spacing" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>Edit Appointment</h3>
              <button className="close-btn" onClick={() => setShowEditPopup(false)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-section">
                <h4>Patient Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Patient Name *</label>
                    <input
                      type="text"
                      name="patientName"
                      placeholder="Enter patient name"
                      value={formData.patientName}
                      onChange={handleChange}
                      list="indian-names"
                      required
                    />
                    <datalist id="indian-names">
                      {indianNames.map((name, index) => (
                        <option key={index} value={name} />
                      ))}
                    </datalist>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Symptoms (Select all that apply)</label>
                    <div className="symptoms-checkbox-grid">
                      {cardiologySymptoms.map((symptom) => (
                        <label key={symptom} className="symptom-checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.symptoms.includes(symptom)}
                            onChange={() => handleSymptomCheckboxChange(symptom)}
                          />
                          <span>{symptom}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Appointment Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      name="date"
                      min={getMinDate()}
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time *</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Appointment Type</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                      <option value="Cardiology">Cardiology</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowEditPopup(false)}>
                  Cancel
                </button>
                <button type="submit" className="confirm-btn">
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

