// import React, { useState } from "react";
// import "./DoctorAppointments.css";

// // ==================== DOCTOR APPOINTMENTS PAGE ====================
// // This component manages doctor's appointment schedule and operations
// // Doctors can view their appointments, update status, and manage patient visits

// function DoctorAppointments() {
//   // ==================== STATE ====================
//   // Stores list of doctor's appointments
//   const [appointments, setAppointments] = useState([
//     ]);

//   // Active tab for different appointment views
//   const [activeTab, setActiveTab] = useState("today");

//   // ==================== PENDING APPOINTMENTS ====================
//   const [pendingAppointments] = useState([
//     { id: 7, patient: "Vikram Singh", date: "2024-01-20", time: "11:00 AM", type: "Consultation", status: "Pending", notes: "First visit" },
//     { id: 8, patient: "Meera Joshi", date: "2024-01-21", time: "09:30 AM", type: "Follow-up", status: "Pending", notes: "Blood test results" },
//     { id: 9, patient: "Ravi Kumar", date: "2024-01-22", time: "02:30 PM", type: "Check-up", status: "Pending", notes: "Annual health check" },
//   ]);

//   // ==================== COMPLETED APPOINTMENTS ====================
//   const [completedAppointments] = useState([
//     { id: 10, patient: "Anjali Desai", date: "2024-01-18", time: "10:00 AM", type: "Check-up", status: "Completed", diagnosis: "Hypertension", notes: "Prescribed medication" },
//     { id: 11, patient: "Suresh Reddy", date: "2024-01-17", time: "11:30 AM", type: "Consultation", status: "Completed", diagnosis: "Diabetes", notes: "Diet consultation" },
//     { id: 12, patient: "Poonam Agarwal", date: "2024-01-16", time: "03:00 PM", type: "Follow-up", status: "Completed", diagnosis: "Recovery good", notes: "Discharge approved" },
//   ]);

//   // ==================== APPOINTMENT HISTORY ====================
//   const [appointmentHistory] = useState([
//     { id: 13, patient: "Arjun Mehta", date: "2024-01-15", time: "09:00 AM", type: "Check-up", status: "Completed", diagnosis: "Healthy" },
//     { id: 14, patient: "Neha Kapoor", date: "2024-01-14", time: "10:30 AM", type: "Consultation", status: "Completed", diagnosis: "Migraine" },
//     { id: 15, patient: "Rohit Verma", date: "2024-01-13", time: "02:00 PM", type: "Follow-up", status: "Completed", diagnosis: "Improving" },
//     { id: 16, patient: "Sneha Patel", date: "2024-01-12", time: "11:15 AM", type: "Check-up", status: "Completed", diagnosis: "Normal" },
//     { id: 17, patient: "Vivek Sharma", date: "2024-01-11", time: "04:00 PM", type: "Consultation", status: "Completed", diagnosis: "Flu" },
//   ]);

//   // Controls form visibility for adding new appointments
//   const [showForm, setShowForm] = useState(false);
//   // Stores form data
//   const [formData, setFormData] = useState({
//     patient: "",
//     date: "",
//     time: "",
//     type: "Consultation",
//     notes: "",
//   });

//   // Filter appointments by date/status
//   const [filterDate, setFilterDate] = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");

//   // ==================== HANDLER FUNCTIONS ====================
//   // Handle input changes in form
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add new appointment to the list
//     const newAppointment = {
//       id: appointments.length + 1,
//       ...formData,
//       status: "Pending",
//     };
//     setAppointments([...appointments, newAppointment]);
//     // Reset form
//     setFormData({
//       patient: "",
//       date: "",
//       time: "",
//       type: "Consultation",
//       notes: "",
//     });
//     setShowForm(false);
//   };

//   // Update appointment status
//   const updateStatus = (id, newStatus) => {
//     setAppointments(appointments.map(apt =>
//       apt.id === id ? { ...apt, status: newStatus } : apt
//     ));
//   };

//   // Delete appointment
//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to cancel this appointment?")) {
//       setAppointments(appointments.filter((apt) => apt.id !== id));
//     }
//   };

//   // Filter appointments based on selected filters
//   const filteredAppointments = appointments.filter((apt) => {
//     const matchesDate = !filterDate || apt.date === filterDate;
//     const matchesStatus = filterStatus === "All" || apt.status === filterStatus;
//     return matchesDate && matchesStatus;
//   });

//   return (
//     <div className="doctor-appointments-page">
//       {/* ==================== PAGE HEADER ==================== */}
//       <div className="page-header">
//         <h1>My Appointments</h1>
//         <button className="add-btn" onClick={() => setShowForm(!showForm)}>
//           {showForm ? "Cancel" : "+ Schedule Appointment"}
//         </button>
//       </div>

//       {/* ==================== APPOINTMENT TABS ==================== */}
//       <div className="appointment-tabs">
//         <button
//           className={`tab-btn ${activeTab === "today" ? "active" : ""}`}
//           onClick={() => setActiveTab("today")}
//         >
//           Today's Appointments ({appointments.length})
//         </button>
//         <button
//           className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
//           onClick={() => setActiveTab("pending")}
//         >
//           Pending Appointments ({pendingAppointments.length})
//         </button>
//         <button
//           className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
//           onClick={() => setActiveTab("completed")}
//         >
//           Completed Appointments ({completedAppointments.length})
//         </button>
//         <button
//           className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
//           onClick={() => setActiveTab("history")}
//         >
//           Appointment History ({appointmentHistory.length})
//         </button>
//       </div>

//       {/* ==================== SUMMARY STATISTICS ==================== */}
//       {/* Shows quick statistics about appointments */}
//       <div className="summary-stats">
//         <div className="summary-card">
//           <h4>Total Appointments</h4>
//           <p>{appointments.length}</p>
//         </div>
//         <div className="summary-card">
//           <h4>Today's Appointments</h4>
//           <p>{appointments.filter((a) => a.date === new Date().toISOString().split("T")[0]).length}</p>
//         </div>
//         <div className="summary-card">
//           <h4>Pending</h4>
//           <p>{appointments.filter((a) => a.status === "Pending").length}</p>
//         </div>
//         <div className="summary-card">
//           <h4>Completed</h4>
//           <p>{appointments.filter((a) => a.status === "Completed").length}</p>
//         </div>
//       </div><br></br>

//       {/* ==================== QUICK ACTIONS ==================== */}
//       <div className="quick-actions">
//         <h2>Quick Actions</h2>
//         <div className="action-buttons">
//           <button className="action-btn">
//             📅 Schedule New Appointment
//           </button>
//           <button className="action-btn">
//             👥 Add Patient Note
//           </button>
//           <button className="action-btn">
//             📋 Generate Report
//           </button>
//           <button className="action-btn">
//             💊 Prescribe Medication
//           </button>
//         </div>
//       </div>

//       {/* ==================== NEW APPOINTMENT FORM ==================== */}
//       {/* Hidden by default, shown when "+ Schedule Appointment" is clicked */}
//       {showForm && (
//         <div className="form-container">
//           <h3>Schedule New Appointment</h3>
//           <form onSubmit={handleSubmit}>
//             <div className="form-row">
//               <input
//                 type="text"
//                 name="patient"
//                 placeholder="Patient Name"
//                 value={formData.patient}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-row">
//               <input
//                 type="time"
//                 name="time"
//                 value={formData.time}
//                 onChange={handleChange}
//                 required
//               />
//               <select name="type" value={formData.type} onChange={handleChange}>
//                 <option value="Consultation">Consultation</option>
//                 <option value="Follow-up">Follow-up</option>
//                 <option value="Check-up">Check-up</option>
//                 <option value="Emergency">Emergency</option>
//                 <option value="Surgery">Surgery</option>
//               </select>
//             </div>
//             <div className="form-row">
//               <textarea
//                 name="notes"
//                 placeholder="Appointment Notes"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 rows="2"
//               />
//             </div>
//             <div className="form-row">
//               <button type="submit" className="submit-btn">
//                 Schedule Appointment
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* ==================== APPOINTMENTS CONTENT ==================== */}
//       {activeTab === "today" && (
//         <div className="appointments-content">
//           <h2>Today's Appointments</h2>
//           <div className="table-container">
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Patient Name</th>
//                   <th>Time</th>
//                   <th>Type</th>
//                   <th>Status</th>
//                   <th>Notes</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredAppointments.map((apt) => (
//                   <tr key={apt.id}>
//                     <td>#{apt.id}</td>
//                     <td>{apt.patient}</td>
//                     <td>{apt.time}</td>
//                     <td>{apt.type}</td>
//                     <td>
//                       <select
//                         value={apt.status}
//                         onChange={(e) => updateStatus(apt.id, e.target.value)}
//                         className={`status-select ${apt.status.toLowerCase()}`}
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="Confirmed">Confirmed</option>
//                         <option value="Completed">Completed</option>
//                         <option value="Cancelled">Cancelled</option>
//                       </select>
//                     </td>
//                     <td>{apt.notes}</td>
//                     <td>
//                       <button className="view-btn">View Details</button>
//                       <button className="edit-btn">Edit</button>
//                       <button className="delete-btn" onClick={() => handleDelete(apt.id)}>
//                         Cancel
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {activeTab === "pending" && (
//         <div className="appointments-content">
//           <h2>Pending Appointments</h2>
//           <div className="appointments-list">
//             {pendingAppointments.map((apt) => (
//               <div key={apt.id} className="appointment-card pending">
//                 <div className="appointment-header">
//                   <h4>{apt.patient}</h4>
//                   <span className="appointment-date">{apt.date} at {apt.time}</span>
//                 </div>
//                 <div className="appointment-details">
//                   <p><strong>Type:</strong> {apt.type}</p>
//                   <p><strong>Notes:</strong> {apt.notes}</p>
//                 </div>
//                 <div className="appointment-actions">
//                   <button className="confirm-btn">Confirm</button>
//                   <button className="reschedule-btn">Reschedule</button>
//                   <button className="cancel-btn" onClick={() => handleDelete(apt.id)}>Cancel</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {activeTab === "completed" && (
//         <div className="appointments-content">
//           <h2>Completed Appointments</h2>
//           <div className="appointments-list">
//             {completedAppointments.map((apt) => (
//               <div key={apt.id} className="appointment-card completed">
//                 <div className="appointment-header">
//                   <h4>{apt.patient}</h4>
//                   <span className="appointment-date">{apt.date} at {apt.time}</span>
//                 </div>
//                 <div className="appointment-details">
//                   <p><strong>Type:</strong> {apt.type}</p>
//                   <p><strong>Diagnosis:</strong> {apt.diagnosis}</p>
//                   <p><strong>Notes:</strong> {apt.notes}</p>
//                 </div>
//                 <div className="appointment-actions">
//                   <button className="view-btn">View Full Report</button>
//                   <button className="followup-btn">Schedule Follow-up</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {activeTab === "history" && (
//         <div className="appointments-content">
//           <h2>Appointment History</h2>
//           <div className="appointments-list">
//             {appointmentHistory.map((apt) => (
//               <div key={apt.id} className="appointment-card history">
//                 <div className="appointment-header">
//                   <h4>{apt.patient}</h4>
//                   <span className="appointment-date">{apt.date} at {apt.time}</span>
//                 </div>
//                 <div className="appointment-details">
//                   <p><strong>Type:</strong> {apt.type}</p>
//                   <p><strong>Diagnosis:</strong> {apt.diagnosis}</p>
//                   <p><strong>Status:</strong> {apt.status}</p>
//                 </div>
//                 <div className="appointment-actions">
//                   <button className="view-btn">View Details</button>
//                   <button className="export-btn">Export Report</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

      
//     </div>
//   );
// }

// export default DoctorAppointments;
import React, { useState, useEffect } from "react";
import "./DoctorAppointments.css";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    completed: 0
  });
  const [activeTab, setActiveTab] = useState("today");

  useEffect(() => {
    fetchDoctorAppointments();
    fetchStats();
  }, []);

  const fetchDoctorAppointments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/appointments/doctor/Dr.%20Sharma');
      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/appointments/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Appointment status updated to ${newStatus}`);
        fetchDoctorAppointments();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('❌ Failed to update status');
    }
  };

  const getTodaysAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === today);
  };

  const getPendingAppointments = () => {
    return appointments.filter(apt => apt.status === 'Pending');
  };

  const getCompletedAppointments = () => {
    return appointments.filter(apt => apt.status === 'Completed');
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="doctor-appointments-page">
      <div className="page-header">
        <h1>My Appointments</h1>
      </div>

      {/* ==================== SUMMARY STATISTICS ==================== */}
      <div className="summary-stats">
        <div className="summary-card">
          <h4>Total Appointments</h4>
          <p>{stats.total}</p>
        </div>
        <div className="summary-card">
          <h4>Today's Appointments</h4>
          <p>{stats.today}</p>
        </div>
        <div className="summary-card">
          <h4>Pending</h4>
          <p>{stats.pending}</p>
        </div>
        <div className="summary-card">
          <h4>Completed</h4>
          <p>{stats.completed}</p>
        </div>
      </div>

      {/* ==================== APPOINTMENT TABS ==================== */}
      <div className="appointment-tabs">
        <button
          className={`tab-btn ${activeTab === "today" ? "active" : ""}`}
          onClick={() => setActiveTab("today")}
        >
          Today's Appointments ({getTodaysAppointments().length})
        </button>
        <button
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Appointments ({getPendingAppointments().length})
        </button>
        <button
          className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Completed Appointments ({getCompletedAppointments().length})
        </button>
        <button
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Appointments ({appointments.length})
        </button>
      </div>

      {/* ==================== APPOINTMENTS CONTENT ==================== */}
      <div className="appointments-content">
        {activeTab === "today" && (
          <>
            <h2>Today's Appointments</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Type</th>
                    <th>Symptoms</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getTodaysAppointments().map((apt) => (
                    <tr key={apt._id}>
                      <td>{apt.time}</td>
                      <td>{apt.patientName}</td>
                      <td>{apt.age}</td>
                      <td>{apt.gender}</td>
                      <td>{apt.phone}</td>
                      <td>{apt.type}</td>
                      <td>{apt.symptoms || 'N/A'}</td>
                      <td>
                        <select
                          value={apt.status}
                          onChange={(e) => updateStatus(apt._id, e.target.value)}
                          className={`status-select ${apt.status.toLowerCase()}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button className="view-btn">View</button>
                        <button className="edit-btn">Edit</button>
                      </td>
                    </tr>
                  ))}
                  {getTodaysAppointments().length === 0 && (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                        No appointments for today
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "pending" && (
          <>
            <h2>Pending Appointments</h2>
            <div className="appointments-list">
              {getPendingAppointments().map((apt) => (
                <div key={apt._id} className="appointment-card pending">
                  <div className="appointment-header">
                    <h4>{apt.patientName}</h4>
                    <span className="appointment-date">{apt.date} at {apt.time}</span>
                  </div>
                  <div className="appointment-details">
                    <p><strong>Age:</strong> {apt.age} | <strong>Gender:</strong> {apt.gender}</p>
                    <p><strong>Phone:</strong> {apt.phone}</p>
                    <p><strong>Symptoms:</strong> {apt.symptoms || 'N/A'}</p>
                  </div>
                  <div className="appointment-actions">
                    <button className="confirm-btn" onClick={() => updateStatus(apt._id, 'Confirmed')}>
                      Confirm
                    </button>
                    <button className="reschedule-btn">Reschedule</button>
                    <button className="cancel-btn" onClick={() => updateStatus(apt._id, 'Cancelled')}>
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
              {getPendingAppointments().length === 0 && (
                <div className="no-appointments">
                  <p>No pending appointments</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "completed" && (
          <>
            <h2>Completed Appointments</h2>
            <div className="appointments-list">
              {getCompletedAppointments().map((apt) => (
                <div key={apt._id} className="appointment-card completed">
                  <div className="appointment-header">
                    <h4>{apt.patientName}</h4>
                    <span className="appointment-date">{apt.date} at {apt.time}</span>
                  </div>
                  <div className="appointment-details">
                    <p><strong>Age:</strong> {apt.age} | <strong>Gender:</strong> {apt.gender}</p>
                    <p><strong>Phone:</strong> {apt.phone}</p>
                    <p><strong>Symptoms:</strong> {apt.symptoms || 'N/A'}</p>
                  </div>
                  <div className="appointment-actions">
                    <button className="view-btn">View Details</button>
                    <button className="followup-btn">Schedule Follow-up</button>
                  </div>
                </div>
              ))}
              {getCompletedAppointments().length === 0 && (
                <div className="no-appointments">
                  <p>No completed appointments</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "all" && (
          <>
            <h2>All Appointments</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt._id}>
                      <td>{apt.appointmentId}</td>
                      <td>{apt.patientName}</td>
                      <td>{apt.date}</td>
                      <td>{apt.time}</td>
                      <td>{apt.age}</td>
                      <td>{apt.gender}</td>
                      <td>{apt.phone}</td>
                      <td>
                        <span className={`status-badge ${apt.status.toLowerCase()}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td>
                        <button className="view-btn">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DoctorAppointments;