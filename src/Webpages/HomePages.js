import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import doctorImg from "../Images.js/doctor.png";
import hospitalImg from "../Images.js/hospital.png";
import Carousel from "react-bootstrap/Carousel";

function HomePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const aboutRef = useRef(null);

  const openLoginPopup = (userRole) => {
    setRole(userRole);
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);
  const closeSignupPopup = () => setShowSignupPopup(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === "Receptionist") {
      navigate("/receptionist-dashboard");
    } else if (role === "Doctor") {
      navigate("/doctor-dashboard");
    }
    closePopup();
  };

  const scrollToAbout = () => {
    aboutRef.current.scrollIntoView({ behavior: "smooth" });
  };

  //UP FORM HANDLERS ====================
  const handleSignupChange = (e) => {
    const { name, value } = e.target;

    // STRICT MOBILE NUMBER HANDLING
    if (name === "mobileNumber") {
      let numericValue = value.replace(/\D/g, "");

      // Block if first digit is not 7, 8, or 9
      if (numericValue.length > 0 && !/^[789]/.test(numericValue)) {
        return;
      }

      // Limit to 10 digits
      if (numericValue.length > 10) return;

      setFormData({ ...formData, mobileNumber: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateSignupForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (formData.mobileNumber.length !== 10) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    } else if (!/^[789]/.test(formData.mobileNumber)) {
      newErrors.mobileNumber =
        "Mobile number must start with 7, 8, or 9";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    if (validateSignupForm()) {
      console.log("Signup Data:", formData);
      closeSignupPopup();
      setFormData({
        fullName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        mobileNumber: "",
      });
    }
  };

  return (
    <div className="container-fluid">
      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="logo">🏥 Advance Hospital</div>
        <nav>
          <a href="/">Home</a>
          <button onClick={scrollToAbout} style={{ cursor: "pointer", background: "none", border: "none", color: "inherit", fontSize: "inherit" }}>
            About Us
          </button>
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
        <div className="hero left">
          <h1>Advance Hospital Management System</h1>
          <p>
            A secure, digital platform for managing doctor appointments,
            patient records, and hospital operations efficiently.
          </p>
          <button className="learn-btn" onClick={scrollToAbout}>
            Learn More
          </button>
        </div>

        <div className="carousel right">
          <Carousel fade controls indicators>
            <Carousel.Item>
              <img
                src={hospitalImg}
                alt="Hospital"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
              <Carousel.Caption>
                <h3>Advance Hospital</h3>
                <p>State-of-the-art healthcare facility</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img
                src={doctorImg}
                alt="Doctor"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
              <Carousel.Caption>
                <h3>Expert Doctors</h3>
                <p>Highly qualified medical professionals</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img
                src={hospitalImg}
                alt="Hospital"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
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
          technology.
        </p>

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
              <button className="login" onClick={handleLogin}>
                Login
              </button>
              <button className="cancel" onClick={closePopup}>
                Cancel
              </button>
            </div>
            
            <p className="signup-link">
              Don't have an account?{" "}
              <span onClick={() => { closePopup(); setShowSignupPopup(true); }}>
                Sign Up
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ===== SIGNUP POPUP ===== */}
      {showSignupPopup && (
        <div className="popup-overlay">
          <div className="popup signup-popup">
            <h2>Create Account</h2>

            <form onSubmit={handleSignupSubmit}>
              {/* FULL NAME + EMAIL */}
              <div className="form-row">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleSignupChange}
                />
                {errors.fullName && <span className="error">{errors.fullName}</span>}

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleSignupChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              {/* USERNAME + MOBILE */}
              <div className="form-row">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleSignupChange}
                />
                {errors.username && <span className="error">{errors.username}</span>}

                <input
                  type="text"
                  name="mobileNumber"
                  placeholder="Mobile Number (Starts with 7, 8 or 9)"
                  value={formData.mobileNumber}
                  onChange={handleSignupChange}
                  inputMode="numeric"
                  maxLength={10}
                />
                {errors.mobileNumber && (
                  <span className="error">{errors.mobileNumber}</span>
                )}
              </div>

              {/* PASSWORDS */}
              <div className="form-row">
                <input
                  type="password"
                  name="password"
                  placeholder="Password (min 6 chars)"
                  value={formData.password}
                  onChange={handleSignupChange}
                />
                {errors.password && <span className="error">{errors.password}</span>}

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleSignupChange}
                />
                {errors.confirmPassword && (
                  <span className="error">{errors.confirmPassword}</span>
                )}
              </div>

              {/* ACTIONS */}
              <div className="popup-actions">
                <button type="submit" className="login">
                  Sign Up
                </button>
                <button
                  type="button"
                  className="cancel"
                  onClick={closeSignupPopup}
                >
                  Cancel
                </button>
              </div>
            </form>

            <p className="login-link">
              Already have an account?{" "}
              <span onClick={() => { closeSignupPopup(); setShowPopup(true); }}>
                Login
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div>
          <h4>Advance Hospital</h4>
          <p>Dhule, Maharashtra</p>
          <p>Email: support@advancehospital.com</p>
        </div>

        <div>
          <h4>Terms & Conditions</h4>
          <p>Privacy Policy</p>
          <p>User Agreement</p>
        </div>

        <div>
          <h4>Hospital Location</h4>
          <iframe
            title="hospital-map"
            src="https://www.google.com/maps/embed?pb=!4v1770462259569!6m8!1m7!1sVxVvvQZtKJZjePpUvFAzAQ!2m2!1d20.91664272034978!2d74.77042149969776!3f119.09408205301271!4f28.71417756552215!5f0.7820865974627469">
         </iframe>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;

