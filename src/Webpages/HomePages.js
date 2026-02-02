import React, { useState, useRef } from "react";
import "./HomePage.css";
import doctorImg from "../Images.js/doctor.png";
import hospitalImg from "../Images.js/hospital.png";
import Carousel from 'react-bootstrap/Carousel';


function HomePage() {
  // -------------------- STATE --------------------
  const [showPopup, setShowPopup] = useState(false); // Controls whether login popup is visible
  const [role, setRole] = useState(""); // Stores the role of the user for popup (Doctor/Receptionist)

  // -------------------- REF --------------------
  const aboutRef = useRef(null); // Reference to the About section for scrolling

  // -------------------- FUNCTIONS --------------------
  const openLoginPopup = (userRole) => {
    setRole(userRole); // Set role for popup
    setShowPopup(true); // Show popup
  };

  const closePopup = () => {
    setShowPopup(false); // Hide popup
  };

  const scrollToAbout = () => {
    // Smooth scroll to About section
    aboutRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container-fluid">
      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="logo">🏥 Advance Hospital</div>
        <nav>
          <a href="#">Home</a>
          {/* Scrolls to About section instead of navigating */}
          <a onClick={scrollToAbout} style={{ cursor: "pointer" }}>
            About Us
          </a>
          {/* Buttons open login popup with selected role */}
          <button
            className="login-btn"
            onClick={() => openLoginPopup("Receptionist")}
          >
            Receptionist Login
          </button>
          <button
            className="login-btn doctor"
            onClick={() => openLoginPopup("Doctor")}
          >
            Doctor Login
          </button>
        </nav>
      </header>

      {/* ===== HERO + CAROUSEL ===== */}
      <section className="hero-carousel">
        {/* LEFT – HERO TEXT */}
        <div className="hero left">
          <h1>Advance Hospital Management System</h1>
          <p>
            A secure, digital platform for managing doctor appointments,
            patient records, and hospital operations efficiently.
          </p>
          {/* Scroll button */}
          <button className="learn-btn" onClick={scrollToAbout}>
            Learn More
          </button>
        </div>

        

        {/* RIGHT – IMAGE CAROUSEL */}
        <div className="carousel right">
          <Carousel fade controls indicators>
            <Carousel.Item>
              <img src={hospitalImg} alt="Hospital" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
              <Carousel.Caption>
                <h3>Advance Hospital</h3>
                <p>State-of-the-art healthcare facility</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img src={doctorImg} alt="Doctor" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
              <Carousel.Caption>
                <h3>Expert Doctors</h3>
                <p>Highly qualified medical professionals</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img src={hospitalImg} alt="Hospital" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
              <Carousel.Caption>
                <h3>Quality Care</h3>
                <p>Committed to your health and wellbeing</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
  


      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="about" ref={aboutRef}>
        <h2>About Advance Hospital</h2>

        <p>
          Advance Hospital is a modern healthcare institution committed to
          delivering high-quality medical services supported by advanced
          technology. Our Doctor Appointment Management System improves
          efficiency, accuracy, and patient satisfaction.
        </p>

        <p>
          Patients can book appointments online, doctors can manage their
          schedules securely, and receptionists can handle appointments
          efficiently. The system minimizes paperwork and enhances hospital
          workflow.
        </p>

        <p>Key Features:</p>
        <ul>
          <li>Online appointment booking</li>
          <li>Doctor & receptionist login</li>
          <li>Secure patient data management</li>
          <li>Reduced waiting time</li>
          <li>Improved hospital productivity</li>
        </ul>
      </section>

      {/* ===== LOGIN POPUP ===== */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{role} Login</h2>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />

            <div className="popup-actions">
              <button className="login">Login</button>
              <button className="cancel" onClick={closePopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div>
          <h4>Advance Hospital</h4>
          <p>Nashik, Maharashtra</p>
          <p>Email: support@advancehospital.com</p>
        </div>

        <div>
          <h4>Terms & Conditions</h4>
          <p>Privacy Policy</p>
          <p>User Agreement</p>
          <p>Data Security Policy</p>
        </div>

        <div>
          <h4>Hospital Location</h4>
          <iframe
            title="hospital-map"
            src="https://www.google.com/maps?q=nashik&output=embed"
          ></iframe>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;