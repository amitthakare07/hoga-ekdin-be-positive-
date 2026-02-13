import React, { useState } from "react";
import "./Services.css";


function Services() {
  // ==================== STATE ====================
  // Stores list of hospital services
  const [services] = useState([
   
    {
      id: 2,
      name: "Cardiology Consultation",
      description: "Heart health assessment and treatment",
      icon: "❤️",
      price: "$150",
      duration: "45 min",
      available: true,
    },
    
  ]);

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  // Filter by category
  const [categoryFilter, setCategoryFilter] = useState("All");

  // ==================== HELPER FUNCTIONS ====================
  // Get unique categories for filter dropdown
  // For now, we'll show services in a grid format without category filter
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="services-page">
      {/* ==================== PAGE HEADER ==================== */}
      <div className="page-header">
        <h1>Hospital Services</h1>
        <button className="add-btn">+ Add New Service</button>
      </div>

      {/* ==================== SEARCH BAR ==================== */}
      {/* Allows receptionist to search services by name or description */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search services by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* ==================== SERVICES GRID ==================== */}
      {/* Displays all services in a responsive grid layout */}
      <div className="services-grid">
        {filteredServices.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <div className="service-info">
              <h3>{service.name}</h3>
              <p className="service-description">{service.description}</p>
              <div className="service-details">
                <span className="service-price">
                  <strong>Price:</strong> {service.price}
                </span>
                <span className="service-duration">
                  <strong>Duration:</strong> {service.duration}
                </span>
              </div>
              <div className="service-actions">
                <button className="view-btn">Book Now</button>
                <button className="edit-btn">Edit</button>
              </div>
            </div>
            {service.available && <span className="available-badge">Available</span>}
          </div>
        ))}
      </div>

      {/* ==================== SERVICES SUMMARY ==================== */}
      {/* Shows summary statistics about services */}
      <div className="services-summary">
        <div className="summary-card">
          <h4>Total Services</h4>
          <p>{services.length}</p>
        </div>
        <div className="summary-card">
          <h4>Available Now</h4>
          <p>{services.filter((s) => s.available).length}</p>
        </div>
        <div className="summary-card">
          <h4>Starting Price</h4>
          <p>$30</p>
        </div>
        <div className="summary-card">
          <h4>Specialist Services</h4>
          <p>6</p>
        </div>
      </div>

      {/* ==================== HOSPITAL INFO SECTION ==================== */}
      {/* Additional information about the hospital */}
      <div className="hospital-info-section">
        <h2>About Our Hospital</h2>
        <div className="info-cards">
          <div className="info-card">
            <h3>🏥 Our Mission</h3>
            <p>To provide world-class healthcare services to all our patients with compassion and excellence.</p>
          </div>
          <div className="info-card">
            <h3>👨‍⚕️ Expert Team</h3>
            <p>Our hospital is staffed with highly qualified doctors, nurses, and support staff dedicated to your health.</p>
          </div>
          <div className="info-card">
            <h3>🕒 24/7 Availability</h3>
            <p>We provide round-the-clock emergency services and have specialists available at all times.</p>
          </div>
          <div className="info-card">
            <h3>🧹 Clean & Safe</h3>
            <p>Our facility maintains the highest standards of cleanliness and safety protocols.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;

