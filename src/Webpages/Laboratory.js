import React, { useState } from "react";
import "./Laboratory.css";
// ==================== REPORTS PAGE ====================
// This component generates and displays various hospital reports
// Receptionists can view appointment statistics, patient trends, etc.

function Reports() {
  // ==================== STATE ====================
  // Stores report data
  const [selectedReport, setSelectedReport] = useState("appointments");
  // Date range for filtering reports
  // const [dateRange, setDateRange] = useState({
  //   start: new Date().toISOString().split("T")[0],
  //   end: new Date().toISOString().split("T")[0],
  // });

   const [patients, setPatients] = useState([
      // { id: 1, name: "John Doe", age: 45, gender: "Male", phone: "9876543210", email: "john@example.com", address: "123 Main St", joinDate: "2024-01-10" },
      // { id: 2, name: "Jane Smith", age: 32, gender: "Female", phone: "9876543211", email: "jane@example.com", address: "456 Oak Ave", joinDate: "2024-01-08" },
      // { id: 3, name: "Mike Brown", age: 28, gender: "Male", phone: "9876543212", email: "mike@example.com", address: "789 Pine Rd", joinDate: "2024-01-05" },
      // { id: 4, name: "Sarah Wilson", age: 55, gender: "Female", phone: "9876543213", email: "sarah@example.com", address: "321 Elm St", joinDate: "2024-01-03" },
      // { id: 5, name: "David Lee", age: 40, gender: "Male", phone: "9876543214", email: "david@example.com", address: "654 Maple Dr", joinDate: "2024-01-01" },
    ]);

  // ==================== REPORT DATA ====================
  // Mock data for various reports
  const appointmentStats = {
    total: 156,
    completed: 128,
    cancelled: 18,
    pending: 10,
    today: 28,
  };

  const patientStats = {
    total: 1247,
    newThisMonth: 89,
    returning: 156,
    byDepartment: [
      { department: "General", count: 450 },
      { department: "Cardiology", count: 280 },
      { department: "Dental", count: 200 },
      { department: "Neurology", count: 180 },
      { department: "Orthopedics", count: 137 },
    ],
  };



  const recentReports = [
    { id: 1, name: "Monthly Appointment Summary", date: "2024-01-15", type: "appointments" },
    { id: 2, name: "Patient Registration Report", date: "2024-01-14", type: "patients" },
    { id: 3, name: "Doctor Performance Analysis", date: "2024-01-13", type: "doctors" },
    { id: 4, name: "Revenue Statistics - December", date: "2024-01-01", type: "revenue" },
  ];

  // ==================== HELPER FUNCTIONS ====================
  // Handle report type change
  const handleReportChange = (reportType) => {
    setSelectedReport(reportType);
  };

  // Calculate percentage for progress bars
  const calculatePercentage = (value, total) => {
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <div className="reports-page">
      {/* ==================== PAGE HEADER ==================== */}
      <div className="page-header">
        <h1>Laboratory Status</h1>
        
      </div>

      {/* ==================== REPORT TABS ==================== */}
      {/* Allows switching between different report types */}
      <div className="report-tabs">
        <button
          className={`report-tab ${selectedReport === "appointments" ? "active" : ""}`}
          onClick={() => handleReportChange("appointments")}
        >
          📅 2D-Echocardiogram
        </button>
        <button
          className={`report-tab ${selectedReport === "patients" ? "active" : ""}`}
          onClick={() => handleReportChange("patients")}
        >
          👥 Electrocardiogram
        </button>
        <button
          className={`report-tab ${selectedReport === "doctors" ? "active" : ""}`}
          onClick={() => handleReportChange("doctors")}
        >
          👨‍⚕️ Treadmill Test
        </button>

      </div>

      {/* ==================== REPORT CONTENT ==================== */}
      {/* Displays report-specific content based on selected tab */}
      <div className="report-content">
        {selectedReport === "appointments" && (
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
              <h4>New This Week</h4>
              <p>{patients.filter((p) => new Date(p.joinDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</p>
            </div>
          </div>
        )}

        {selectedReport === "patients" && (
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
              <h4>New This Week</h4>
              <p>{patients.filter((p) => new Date(p.joinDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</p>
            </div>
          </div>
        )}

        {selectedReport === "doctors" && (
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
              <h4>New This Week</h4>
              <p>{patients.filter((p) => new Date(p.joinDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</p>
            </div>
          </div>
        )}
      </div>

      {/* ==================== RECENT REPORTS ==================== */}
      {/* Shows recently generated reports */}
      {/* <div className="recent-reports-section">
        <h2>Recent Reports</h2>
        <div className="recent-reports-list">
          {recentReports.map((report) => (
            <div key={report.id} className="report-item">
              <div className="report-icon">
                {report.type === "appointments" && "📅"}
                {report.type === "patients" && "👥"}
                {report.type === "doctors" && "👨‍⚕️"}
                {report.type === "revenue" && "💰"}
              </div>
              <div className="report-info">
                <h4>{report.name}</h4>
                <p>{report.date}</p>
              </div>
              <button className="download-btn">Download</button>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default Reports;

