import React, { useState } from "react";

// ==================== REPORTS PAGE ====================
// This component generates and displays various hospital reports
// Receptionists can view appointment statistics, patient trends, etc.

function Reports() {
  // ==================== STATE ====================
  // Stores report data
  const [selectedReport, setSelectedReport] = useState("appointments");
  // Date range for filtering reports
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

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

  const revenueData = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 61000 },
    { month: "May", revenue: 55000 },
    { month: "Jun", revenue: 67000 },
  ];

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
        <h1>Reports & Analytics</h1>
        <div className="date-range-picker">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
      </div>

      {/* ==================== REPORT TABS ==================== */}
      {/* Allows switching between different report types */}
      <div className="report-tabs">
        <button
          className={`report-tab ${selectedReport === "appointments" ? "active" : ""}`}
          onClick={() => handleReportChange("appointments")}
        >
          📅 Appointments
        </button>
        <button
          className={`report-tab ${selectedReport === "patients" ? "active" : ""}`}
          onClick={() => handleReportChange("patients")}
        >
          👥 Patients
        </button>
        <button
          className={`report-tab ${selectedReport === "doctors" ? "active" : ""}`}
          onClick={() => handleReportChange("doctors")}
        >
          👨‍⚕️ Doctors
        </button>
        <button
          className={`report-tab ${selectedReport === "revenue" ? "active" : ""}`}
          onClick={() => handleReportChange("revenue")}
        >
          💰 Revenue
        </button>
      </div>

      {/* ==================== REPORT CONTENT ==================== */}
      {/* Displays report-specific content based on selected tab */}
      <div className="report-content">
        {selectedReport === "appointments" && (
          <div className="report-section">
            <h2>Appointment Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Appointments</h3>
                <p className="stat-number">{appointmentStats.total}</p>
              </div>
              <div className="stat-card">
                <h3>Completed</h3>
                <p className="stat-number completed">{appointmentStats.completed}</p>
                <div className="progress-bar">
                  <div
                    className="progress completed"
                    style={{ width: `${calculatePercentage(appointmentStats.completed, appointmentStats.total)}%` }}
                  ></div>
                </div>
              </div>
              <div className="stat-card">
                <h3>Cancelled</h3>
                <p className="stat-number cancelled">{appointmentStats.cancelled}</p>
                <div className="progress-bar">
                  <div
                    className="progress cancelled"
                    style={{ width: `${calculatePercentage(appointmentStats.cancelled, appointmentStats.total)}%` }}
                  ></div>
                </div>
              </div>
              <div className="stat-card">
                <h3>Today's Appointments</h3>
                <p className="stat-number">{appointmentStats.today}</p>
              </div>
            </div>
          </div>
        )}

        {selectedReport === "patients" && (
          <div className="report-section">
            <h2>Patient Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Patients</h3>
                <p className="stat-number">{patientStats.total}</p>
              </div>
              <div className="stat-card">
                <h3>New This Month</h3>
                <p className="stat-number new">{patientStats.newThisMonth}</p>
              </div>
              <div className="stat-card">
                <h3>Returning Patients</h3>
                <p className="stat-number">{patientStats.returning}</p>
              </div>
            </div>
            <div className="department-chart">
              <h3>Patients by Department</h3>
              {patientStats.byDepartment.map((dept) => (
                <div key={dept.department} className="chart-row">
                  <span className="chart-label">{dept.department}</span>
                  <div className="chart-bar-container">
                    <div
                      className="chart-bar"
                      style={{ width: `${calculatePercentage(dept.count, patientStats.total)}%` }}
                    ></div>
                  </div>
                  <span className="chart-value">{dept.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedReport === "doctors" && (
          <div className="report-section">
            <h2>Doctor Performance</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Doctors</h3>
                <p className="stat-number">18</p>
              </div>
              <div className="stat-card">
                <h3>Available Today</h3>
                <p className="stat-number">15</p>
              </div>
              <div className="stat-card">
                <h3>Appointments This Week</h3>
                <p className="stat-number">89</p>
              </div>
              <div className="stat-card">
                <h3>Avg. Rating</h3>
                <p className="stat-number">4.8/5</p>
              </div>
            </div>
          </div>
        )}

        {selectedReport === "revenue" && (
          <div className="report-section">
            <h2>Revenue Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Revenue (6 months)</h3>
                <p className="stat-number">${revenueData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <h3>Average Monthly</h3>
                <p className="stat-number">
                  ${Math.round(revenueData.reduce((sum, d) => sum + d.revenue, 0) / revenueData.length).toLocaleString()}
                </p>
              </div>
              <div className="stat-card">
                <h3>Highest Month</h3>
                <p className="stat-number">${Math.max(...revenueData.map((d) => d.revenue)).toLocaleString()}</p>
              </div>
            </div>
            <div className="revenue-chart">
              <h3>Monthly Revenue Trend</h3>
              <div className="chart-bars">
                {revenueData.map((data) => (
                  <div key={data.month} className="chart-bar-item">
                    <div className="bar-container">
                      <div
                        className="bar"
                        style={{ height: `${(data.revenue / 70000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="bar-label">{data.month}</span>
                    <span className="bar-value">${(data.revenue / 1000).toFixed(0)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== RECENT REPORTS ==================== */}
      {/* Shows recently generated reports */}
      <div className="recent-reports-section">
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
      </div>
    </div>
  );
}

export default Reports;

