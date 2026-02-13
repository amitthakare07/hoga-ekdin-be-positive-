// import React, { useState } from "react";
// import "../ReceptionistDashboard.css";

// // ==================== DOCTOR DASHBOARD HOME PAGE ====================
// // This component displays the main dashboard overview with statistics and quick actions
// // It serves as the landing page when doctor logs in

// function DoctorDashboardHome() {
//   // ==================== STATE ====================
//   const [showPopup, setShowPopup] = useState(false); // Controls popup visibility
//   const [popupType, setPopupType] = useState(""); // Stores which popup to show (appointment/patient)

//   // ==================== HELPER FUNCTIONS ====================
//   // Open popup based on type
//   const openPopup = (type) => {
//     setPopupType(type);
//     setShowPopup(true);
//   };

//   // Close popup
//   const closePopup = () => {
//     setShowPopup(false);
//     setPopupType("");
//   };

//   // ==================== STATISTICS DATA ====================
//   // This data represents real-time statistics for the doctor's dashboard
//   const stats = [
//     { label: "Today's Appointments", value: 8, icon: "📅", color: "#1976d2" },
//     { label: "Total Patients", value: 145, icon: "👥", color: "#388e3c" },
//     { label: "Completed Today", value: 5, icon: "✅", color: "#f57c00" },
//     { label: "Pending Reviews", value: 3, icon: "📋", color: "#7b1fa2" },
//   ];

//   // ==================== TODAY'S APPOINTMENTS ====================
//   // This shows today's scheduled appointments
//   const todaysAppointments = [
//     { time: "09:00 AM", patient: "Rajesh Kumar", type: "Checkup", status: "completed" },
//     { time: "10:30 AM", patient: "Priya Sharma", type: "Consultation", status: "in-progress" },
//     { time: "02:00 PM", patient: "Amit Patel", type: "Follow-up", status: "upcoming" },
//     { time: "03:30 PM", patient: "Sunita Gupta", type: "Checkup", status: "upcoming" },
//   ];

//   // ==================== PENDING APPOINTMENTS ====================
//   const pendingAppointments = [
//     { date: "2024-01-20", time: "11:00 AM", patient: "Vikram Singh", type: "Consultation" },
//     { date: "2024-01-21", time: "09:30 AM", patient: "Meera Joshi", type: "Follow-up" },
//     { date: "2024-01-22", time: "02:30 PM", patient: "Ravi Kumar", type: "Checkup" },
//   ];

//   // ==================== COMPLETED APPOINTMENTS ====================
//   const completedAppointments = [
//     { date: "2024-01-18", patient: "Anjali Desai", type: "Checkup", diagnosis: "Hypertension" },
//     { date: "2024-01-17", patient: "Suresh Reddy", type: "Consultation", diagnosis: "Diabetes" },
//     { date: "2024-01-16", patient: "Kavita Nair", type: "Follow-up", diagnosis: "Recovery good" },
//   ];

//   // ==================== APPOINTMENT HISTORY ====================
//   const appointmentHistory = [
//     { date: "2024-01-15", patient: "Arjun Mehta", type: "Checkup", status: "Completed" },
//     { date: "2024-01-14", patient: "Poonam Agarwal", type: "Consultation", status: "Completed" },
//     { date: "2024-01-13", patient: "Deepak Sharma", type: "Follow-up", status: "Completed" },
//     { date: "2024-01-12", patient: "Neha Kapoor", type: "Checkup", status: "Completed" },
//     { date: "2024-01-11", patient: "Rohit Verma", type: "Consultation", status: "Completed" },
//   ];

//   // ==================== RECENT ACTIVITIES ====================
//   // This shows recent activities in the doctor's workflow
//   const recentActivities = [
//     { time: "08:45 AM", activity: "Completed appointment with John Doe", type: "appointment" },
//     { time: "08:30 AM", activity: "Updated patient record for Jane Smith", type: "patient" },
//     { time: "08:15 AM", activity: "Reviewed lab results for Patient #123", type: "lab" },
//     { time: "08:00 AM", activity: "Logged in to system", type: "system" },
//   ];

//   return (
//     <div className="dashboard-home">
//       {/* ==================== PAGE HEADER ==================== */}
//       {/* Displays welcome message and date */}
//       <div className="dashboard-header">
//         <h1>Welcome, Dr. Pranjal Patil</h1>
//         <p className="subtitle">
//           {new Date().toLocaleDateString("en-US", {
//             weekday: "long",
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })}
//         </p>
//       </div>

//       {/* ==================== STATISTICS CARDS ==================== */}
//       {/* Displays key metrics using flexbox for responsive layout */}
//       <div className="stats-grid">
//         {stats.map((stat, index) => (
//           <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
//             <div className="stat-icon" style={{ color: stat.color }}>
//               {stat.icon}
//             </div>
//             <div className="stat-content">
//               <h3>{stat.value}</h3>
//               <p>{stat.label}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ==================== QUICK ACTIONS ==================== */}
//       {/* Quick action buttons for common tasks */}
//       <div className="quick-actions">
//         <h2>Quick Actions</h2>
//         <div className="action-buttons">
//           <button className="action-btn" onClick={() => openPopup("appointment")}>
//             📅 Schedule Appointment
//           </button>
//           <button className="action-btn" onClick={() => openPopup("patient")}>
//             👥 Add Patient Note
//           </button>
//           <button className="action-btn">
//             📋 View Reports
//           </button>
//           <button className="action-btn">
//             💊 Prescribe Medication
//           </button>
//         </div>
//       </div>

//       {/* ==================== TODAY'S APPOINTMENTS ==================== */}
//       {/* Shows today's scheduled appointments */}
//       <div className="appointments-section">
//         <h2>Today's Appointments</h2>
//         <div className="appointments-list">
//           {todaysAppointments.map((apt, index) => (
//             <div key={index} className={`appointment-card ${apt.status}`}>
//               <div className="appointment-time">{apt.time}</div>
//               <div className="appointment-details">
//                 <h4>{apt.patient}</h4>
//                 <p>{apt.type}</p>
//               </div>
//               <div className={`appointment-status ${apt.status}`}>
//                 {apt.status.replace("-", " ")}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ==================== RECENT ACTIVITIES ==================== */}
//       {/* Shows recent activities in the doctor's workflow */}
//       <div className="activities-section">
//         <h2>Recent Activities</h2>
//         <div className="activities-list">
//           {recentActivities.map((activity, index) => (
//             <div key={index} className="activity-item">
//               <span className="activity-time">{activity.time}</span>
//               <span className="activity-text">{activity.activity}</span>
//               <span className={`activity-type ${activity.type}`}>{activity.type}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ==================== POPUP MODALS ==================== */}
//       {/* Reusable popup component for various forms */}
//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup-card">
//             <h2>
//               {popupType === "appointment" && "Schedule New Appointment"}
//               {popupType === "patient" && "Add Patient Note"}
//             </h2>

//             {popupType === "appointment" && (
//               <>
//                 <input type="text" placeholder="Patient Name" />
//                 <input type="date" />
//                 <input type="time" />
//                 <textarea placeholder="Appointment Notes" rows="3"></textarea>
//               </>
//             )}

//             {popupType === "patient" && (
//               <>
//                 <input type="text" placeholder="Patient ID" />
//                 <textarea placeholder="Medical Notes" rows="4"></textarea>
//                 <input type="text" placeholder="Diagnosis" />
//               </>
//             )}

//             <div className="popup-actions">
//               <button className="confirm" onClick={closePopup}>
//                 {popupType === "appointment" && "Schedule Appointment"}
//                 {popupType === "patient" && "Save Note"}
//               </button>
//               <button className="cancel" onClick={closePopup}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DoctorDashboardHome;
import React, { useState, useEffect } from "react";
import "../ReceptionistDashboard.css";

function DoctorDashboardHome() {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    completed: 0
  });
  const [todaysAppointments, setTodaysAppointments] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchTodaysAppointments();
  }, []);

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

  const fetchTodaysAppointments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/appointments/today');
      const data = await response.json();
      if (data.success) {
        setTodaysAppointments(data.appointments);
      }
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error);
    }
  };

  const dashboardStats = [
    { label: "Today's Appointments", value: stats.today || 0, icon: "📅", color: "#1976d2" },
    { label: "Total Patients", value: stats.total || 0, icon: "👥", color: "#388e3c" },
    { label: "Pending Reviews", value: stats.pending || 0, icon: "📋", color: "#f57c00" },
    { label: "Completed Today", value: stats.completed || 0, icon: "✅", color: "#7b1fa2" },
  ];

  const recentActivities = todaysAppointments.slice(0, 4).map(apt => ({
    time: apt.time,
    activity: `Appointment with ${apt.patientName}`,
    type: "appointment"
  }));

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1>Welcome, Dr. Pranjal Patil</h1>
        <p className="subtitle">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="stats-grid">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn">
            📅 View Appointments
          </button>
          <button className="action-btn">
            👥 Patient List
          </button>
          <button className="action-btn">
            📋 View Reports
          </button>
          <button className="action-btn">
            💊 Prescribe Medication
          </button>
        </div>
      </div>

      <div className="appointments-section">
        <h2>Today's Appointments</h2>
        <div className="appointments-list">
          {todaysAppointments.length > 0 ? (
            todaysAppointments.map((apt, index) => (
              <div key={apt._id || index} className="appointment-card">
                <div className="appointment-time">{apt.time}</div>
                <div className="appointment-details">
                  <h4>{apt.patientName}</h4>
                  <p>{apt.type} | Age: {apt.age}</p>
                </div>
                <div className={`appointment-status ${apt.status.toLowerCase()}`}>
                  {apt.status}
                </div>
              </div>
            ))
          ) : (
            <p className="no-appointments">No appointments scheduled for today</p>
          )}
        </div>
      </div>

      <div className="activities-section">
        <h2>Recent Activities</h2>
        <div className="activities-list">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <span className="activity-time">{activity.time}</span>
                <span className="activity-text">{activity.activity}</span>
                <span className={`activity-type ${activity.type}`}>{activity.type}</span>
              </div>
            ))
          ) : (
            <p className="no-activities">No recent activities</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboardHome;