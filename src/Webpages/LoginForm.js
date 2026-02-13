import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginForm({ role, onClose, onSwitchToSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      console.log("📤 Sending login request...");
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          role: role
        }),
      });

      const data = await response.json();
      console.log("📥 Login response:", data);

      if (response.ok && data.success) {
        // Store user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.user.role);
        
        console.log("✅ Login successful!");
        console.log("👤 User:", data.user.fullName);
        console.log("🎭 Role:", data.user.role);
        
        // Navigate based on role
        if (data.user.role === "Receptionist") {
          navigate("/receptionist-dashboard");
        } else if (data.user.role === "Doctor") {
          navigate("/doctor-dashboard");
        }
        
        onClose();
        setUsername("");
        setPassword("");
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setError("Cannot connect to server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUsername("");
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <div className="login-overlay">
      <div className="login-popup">
        <button 
          className="close-btn" 
          onClick={handleClose}
          disabled={isLoading}
        >
          ×
        </button>
        
        <h2 className="login-title">{role} Login</h2>
        
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            disabled={isLoading}
            autoFocus
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            disabled={isLoading}
            required
          />

          <div className="login-actions">
            <button 
              type="submit" 
              className="login-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
            
            <button 
              type="button" 
              className="login-cancel-btn" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>

        <p className="login-switch">
          Don't have an account?{" "}
          <span 
            onClick={() => { 
              handleClose(); 
              onSwitchToSignup(role); 
            }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;