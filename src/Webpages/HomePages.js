import React, { useState, useRef } from "react";
import "./HomePages.css";
import doctorImg from "../Images.js/doctor.png";
import hospitalImg from "../Images.js/hospital.png";
import Carousel from "react-bootstrap/Carousel";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function HomePages() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const aboutRef = useRef(null);

  const openLogin = (role) => {
    setSelectedRole(role);
    setShowLogin(true);
    setShowSignup(false);
  };

  const openSignup = (role) => {
    setSelectedRole(role);
    setShowSignup(true);
    setShowLogin(false);
  };

  const closeLogin = () => {
    setShowLogin(false);
    setSelectedRole("");
  };

  const closeSignup = () => {
    setShowSignup(false);
    setSelectedRole("");
  };

  const scrollToAbout = () => {
    aboutRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-container">
      {/* ===== HEADER ===== */}
      <header className="home-header">
        <div className="home-logo">🏥 Advance Hospital</div>
        <nav className="home-nav">
          <a href="/" className="nav-link">Home</a>
          <button 
            onClick={scrollToAbout} 
            className="nav-btn"
          >
            About Us
          </button>
          <button
            className="login-btn receptionist-btn"
            onClick={() => openLogin("Receptionist")}
          >
            Receptionist Login
          </button>
          <button
            className="login-btn doctor-btn"
            onClick={() => openLogin("Doctor")}
          >
            Doctor Login
          </button>
        </nav>
      </header>

      {/* ===== HERO + CAROUSEL ===== */}
      <section className="hero-carousel">
        <div className="hero-content">
          <h1 className="hero-title">Advance Hospital Management System</h1>
          <p className="hero-description">
            A secure, digital platform for managing doctor appointments,
            patient records, and hospital operations efficiently.
          </p>
          <button className="learn-more-btn" onClick={scrollToAbout}>
            Learn More
          </button>
        </div>

        <div className="carousel-section">
          <Carousel fade controls indicators interval={3000}>
            <Carousel.Item>
              <img
                className="carousel-image"
                src={hospitalImg}
                alt="Hospital"
              />
              <Carousel.Caption className="carousel-caption">
                <h3>Advance Hospital</h3>
                <p>State-of-the-art healthcare facility</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="carousel-image"
                src={doctorImg}
                alt="Doctor"
              />
              <Carousel.Caption className="carousel-caption">
                <h3>Expert Doctors</h3>
                <p>Highly qualified medical professionals</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="carousel-image"
                src={hospitalImg}
                alt="Hospital Care"
              />
              <Carousel.Caption className="carousel-caption">
                <h3>Quality Care</h3>
                <p>Committed to your health and wellbeing</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="about-section" ref={aboutRef}>
        <h2 className="about-title">About Advance Hospital</h2>
        <p className="about-text">
          Advance Hospital is a modern healthcare institution committed to
          delivering high-quality medical services supported by advanced
          technology.
        </p>

        <ul className="features-list">
          <li>Online appointment booking</li>
          <li>Doctor & receptionist login</li>
          <li>Secure patient data management</li>
          <li>Reduced waiting time</li>
          <li>Improved hospital productivity</li>
        </ul>
      </section>

      {/* ===== LOGIN POPUP ===== */}
      {showLogin && (
        <LoginForm
          role={selectedRole}
          onClose={closeLogin}
          onSwitchToSignup={openSignup}
        />
      )}

      {/* ===== SIGNUP POPUP ===== */}
      {showSignup && (
        <SignupForm
          role={selectedRole}
          onClose={closeSignup}
          onSwitchToLogin={openLogin}
        />
      )}

      {/* ===== FOOTER ===== */}
      <footer className="home-footer">
        <div className="footer-section">
          <h4>Advance Hospital</h4>
          <p>Dhule, Maharashtra</p>
          <p>Email: support@advancehospital.com</p>
        </div>

        <div className="footer-section">
          <h4>Terms & Conditions</h4>
          <p>Privacy Policy</p>
          <p>User Agreement</p>
        </div>

        <div className="footer-section">
          <h4>Hospital Location</h4>
          <iframe
            title="hospital-map"
            className="footer-map"
            src="https://www.google.com/maps/embed?pb=!4v1770462259569!6m8!1m7!1sVxVvvQZtKJZjePpUvFAzAQ!2m2!1d20.91664272034978!2d74.77042149969776!3f119.09408205301271!4f28.71417756552215!5f0.7820865974627469"
            frameBorder="0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </footer>
    </div>
  );
}

export default HomePages;