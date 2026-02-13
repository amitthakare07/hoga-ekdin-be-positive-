import React, { useState } from "react";
import "./SignupForm.css";

function SignupForm({ role, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    role: role || "Receptionist"
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNumber") {
      let numericValue = value.replace(/\D/g, "");

      if (numericValue.length > 0 && !/^[789]/.test(numericValue)) {
        return;
      }

      if (numericValue.length > 10) return;

      setFormData({ ...formData, mobileNumber: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
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
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
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
      newErrors.mobileNumber = "Mobile number must start with 7, 8, or 9";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    if (validateForm()) {
      setIsLoading(true);
      
      try {
        console.log("📤 Sending signup request...");
        console.log("Request Data:", formData);
        
        const response = await fetch('http://localhost:8000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log("📥 Response received:", data);

        if (response.ok) {
          console.log("✅ Signup successful!");
          setSuccessMessage("Account created successfully! Please login.");
          
          setTimeout(() => {
            handleClose();
            onSwitchToLogin(role);
          }, 2000);
        } else {
          console.log("❌ Signup failed:", data.message);
          setSubmitError(data.message || "Signup failed. Please try again.");
        }
      } catch (error) {
        console.error("❌ Network error:", error);
        setSubmitError("Cannot connect to server. Please check if backend is running on port 8000.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      mobileNumber: "",
      role: role || "Receptionist"
    });
    setErrors({});
    setSubmitError("");
    setSuccessMessage("");
    onClose();
  };

  return (
    <div className="signup-overlay">
      <div className="signup-popup">
        <button className="signup-close-btn" onClick={handleClose} disabled={isLoading}>×</button>
        <h2 className="signup-title">Create {role} Account</h2>
        
        {submitError && <div className="signup-error">{submitError}</div>}
        {successMessage && <div className="signup-success">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="signup-row">
            <div className="signup-input-group">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? "signup-input error" : "signup-input"}
                disabled={isLoading}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="signup-input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "signup-input error" : "signup-input"}
                disabled={isLoading}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="signup-row">
            <div className="signup-input-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? "signup-input error" : "signup-input"}
                disabled={isLoading}
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="signup-input-group">
              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number (Starts with 7, 8 or 9)"
                value={formData.mobileNumber}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={10}
                className={errors.mobileNumber ? "signup-input error" : "signup-input"}
                disabled={isLoading}
              />
              {errors.mobileNumber && (
                <span className="error-text">{errors.mobileNumber}</span>
              )}
            </div>
          </div>

          <div className="signup-row">
            <div className="signup-input-group">
              <input
                type="password"
                name="password"
                placeholder="Password (min 6 chars)"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "signup-input error" : "signup-input"}
                disabled={isLoading}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="signup-input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "signup-input error" : "signup-input"}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <input type="hidden" name="role" value={formData.role} />

          <div className="signup-actions">
            <button 
              type="submit" 
              className="signup-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
            <button
              type="button"
              className="signup-cancel-btn"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>

        <p className="signup-switch">
          Already have an account?{" "}
          <span onClick={() => { handleClose(); onSwitchToLogin(role); }}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignupForm;