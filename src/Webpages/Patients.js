import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePatients } from "../context/PatientsContext";
import { useAppointments } from "../context/AppointmentsContext";
import { useAdmissions } from "../context/AdmissionsContext";
import "./ReceptionistDashboard.css";

function Patients() {
  const navigate = useNavigate();
  const { patients, addPatient, updatePatient, deletePatient, getPatientStats } = usePatients();
  const { appointments } = useAppointments();
  const { admissions } = useAdmissions();
  
  // ==================== STATE ====================
  const [showForm, setShowForm] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [symptomsDropdownOpen, setSymptomsDropdownOpen] = useState(false);
  const [editSymptomsDropdownOpen, setEditSymptomsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [stats, setStats] = useState({
    total: 0, male: 0, female: 0, other: 0, newThisWeek: 0
  });

  // ==================== CONSTANTS ====================
  const cardiologySymptoms = [
    "Chest Pain", "Shortness of Breath", "Palpitations", "Dizziness",
    "High Blood Pressure", "Fatigue", "Swelling in Legs", "Irregular Heartbeat",
    "Nausea", "Sweating", "Pain in Arms", "Jaw Pain", "Lightheadedness",
    "Rapid Heartbeat", "Slow Heartbeat", "Chest Discomfort", "Coughing",
    "Ankle Swelling", "Bluish Skin", "Fainting", "Confusion",
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const departments = ["Cardiology", "General Physician", "Pediatrics", "Orthopedics", "Neurology", "Dermatology"];

  // ==================== STATISTICS ====================
  useEffect(() => {
    if (patients) {
      const statsData = getPatientStats();
      setStats(statsData);
    }
  }, [patients, getPatientStats]);

  // ==================== FORM STATE ====================
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "Male",
    dob: "",
    email: "",
    phone: "",
    alternatePhone: "",
    address: "",
    symptoms: [],
    bloodGroup: "",
    profession: "",
    nameOfKin: "",
    kinContact: "",
    department: "Cardiology",
    medicalHistory: "",
    allergies: "",
  });

  // ==================== EDIT FORM STATE ====================
  const [editFormData, setEditFormData] = useState({
    patientName: "",
    age: "",
    gender: "Male",
    dob: "",
    email: "",
    phone: "",
    alternatePhone: "",
    address: "",
    symptoms: [],
    bloodGroup: "",
    profession: "",
    nameOfKin: "",
    kinContact: "",
    department: "Cardiology",
    medicalHistory: "",
    allergies: "",
  });

  // ==================== HELPER FUNCTIONS ====================
  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: false 
      }),
    };
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const calculateAgeFromDOB = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  // ==================== VALIDATION FUNCTIONS ====================
  const validateEmail = (email) => {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    if (!phone) return false;
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && ['7', '8', '9'].includes(cleaned[0]);
  };

  const validateAge = (age) => {
    if (!age) return false;
    const ageNum = parseInt(age);
    return !isNaN(ageNum) && ageNum > 0 && ageNum <= 120;
  };

  const validateName = (name) => {
    if (!name) return false;
    const trimmed = name.trim();
    return trimmed.length >= 2 && trimmed.length <= 50;
  };

  const validatePatientForm = (data, setErrorFunc) => {
    const newErrors = {};
    
    if (!validateName(data.patientName)) {
      newErrors.patientName = "Patient name must be between 2-50 characters";
    }
    
    if (!validateAge(data.age)) {
      newErrors.age = "Age must be between 1-120 years";
    }
    
    if (!data.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const age = parseInt(data.age);
      const calculatedAge = parseInt(calculateAgeFromDOB(data.dob));
      if (age !== calculatedAge) {
        newErrors.dob = "Age doesn't match date of birth";
      }
    }
    
    if (!validatePhone(data.phone)) {
      newErrors.phone = "Enter valid 10-digit number starting with 7, 8, or 9";
    }
    
    if (data.alternatePhone && !validatePhone(data.alternatePhone)) {
      newErrors.alternatePhone = "Enter valid 10-digit number starting with 7, 8, or 9";
    }
    
    if (!validateEmail(data.email)) {
      newErrors.email = "Enter valid email address";
    }
    
    if (!data.bloodGroup) {
      newErrors.bloodGroup = "Please select blood group";
    }
    
    if (data.kinContact && !validatePhone(data.kinContact)) {
      newErrors.kinContact = "Enter valid 10-digit emergency contact number";
    }
    
    setErrorFunc(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== HANDLER FUNCTIONS ====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone" || name === "alternatePhone" || name === "kinContact") {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: cleaned }));
      }
    } else if (name === "age") {
      if (value === "" || /^\d+$/.test(value)) {
        const ageNum = parseInt(value);
        if (value === "" || (ageNum >= 0 && ageNum <= 120)) {
          setFormData(prev => ({ ...prev, [name]: value }));
        }
      }
    } else if (name === "dob") {
      const age = calculateAgeFromDOB(value);
      setFormData(prev => ({ ...prev, dob: value, age: age }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // ==================== EDIT HANDLER FUNCTIONS ====================
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone" || name === "alternatePhone" || name === "kinContact") {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 10) {
        setEditFormData(prev => ({ ...prev, [name]: cleaned }));
      }
    } else if (name === "age") {
      if (value === "" || /^\d+$/.test(value)) {
        const ageNum = parseInt(value);
        if (value === "" || (ageNum >= 0 && ageNum <= 120)) {
          setEditFormData(prev => ({ ...prev, [name]: value }));
        }
      }
    } else if (name === "dob") {
      const age = calculateAgeFromDOB(value);
      setEditFormData(prev => ({ ...prev, dob: value, age: age }));
    } else {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (editErrors[name]) {
      setEditErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle symptom checkbox change
  const handleSymptomChange = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  // Handle edit symptom checkbox change
  const handleEditSymptomChange = (symptom) => {
    setEditFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  // Toggle symptoms dropdown
  const toggleSymptomsDropdown = () => {
    setSymptomsDropdownOpen(!symptomsDropdownOpen);
  };

  // Toggle edit symptoms dropdown
  const toggleEditSymptomsDropdown = () => {
    setEditSymptomsDropdownOpen(!editSymptomsDropdownOpen);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      patientName: "",
      age: "",
      gender: "Male",
      dob: "",
      email: "",
      phone: "",
      alternatePhone: "",
      address: "",
      symptoms: [],
      bloodGroup: "",
      profession: "",
      nameOfKin: "",
      kinContact: "",
      department: "Cardiology",
      medicalHistory: "",
      allergies: "",
    });
    setErrors({});
    setSymptomsDropdownOpen(false);
  };

  // Reset edit form
  const resetEditForm = () => {
    setEditFormData({
      patientName: "",
      age: "",
      gender: "Male",
      dob: "",
      email: "",
      phone: "",
      alternatePhone: "",
      address: "",
      symptoms: [],
      bloodGroup: "",
      profession: "",
      nameOfKin: "",
      kinContact: "",
      department: "Cardiology",
      medicalHistory: "",
      allergies: "",
    });
    setEditErrors({});
    setEditSymptomsDropdownOpen(false);
  };

  // Open add patient form
  const handleAddFormOpen = () => {
    resetForm();
    setShowForm(true);
  };

  // Handle add patient submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validatePatientForm(formData, setErrors)) return;
    
    // Check for duplicate patient
    const isDuplicate = patients.some(p => 
      p.phone === formData.phone || p.email === formData.email
    );
    
    if (isDuplicate) {
      alert("❌ Patient with this phone number or email already exists!");
      return;
    }
    
    const { date, time } = getCurrentDateTime();
    
    const patientData = {
      ...formData,
      registeredDate: date,
      registeredTime: time,
    };
    
    addPatient(patientData);
    alert(`✅ Patient ${formData.patientName} registered successfully!`);
    
    resetForm();
    setShowForm(false);
  };

  // Open view popup
  const handleView = (patient) => {
    setSelectedPatient(patient);
    setShowViewPopup(true);
  };

  // ✅ FIXED: Open edit popup with FULL form
  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    
    // Parse symptoms string to array
    const symptomsArray = patient.symptoms 
      ? patient.symptoms.split(", ").filter(s => s) 
      : [];
    
    setEditFormData({
      patientName: patient.patientName || "",
      age: patient.age || "",
      gender: patient.gender || "Male",
      dob: patient.dob || "",
      email: patient.email || "",
      phone: patient.phone || "",
      alternatePhone: patient.alternatePhone || "",
      address: patient.address || "",
      symptoms: symptomsArray,
      bloodGroup: patient.bloodGroup || "",
      profession: patient.profession || "",
      nameOfKin: patient.nameOfKin || "",
      kinContact: patient.kinContact || "",
      department: patient.department || "Cardiology",
      medicalHistory: patient.medicalHistory || "",
      allergies: patient.allergies || "",
    });
    
    setEditErrors({});
    setEditSymptomsDropdownOpen(false);
    setShowEditPopup(true);
  };

  // ✅ FIXED: Handle edit submit with FULL form data
  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    if (!validatePatientForm(editFormData, setEditErrors)) return;
    
    // Check for duplicate (excluding current patient)
    const isDuplicate = patients.some(p => 
      p.id !== selectedPatient.id && 
      (p.phone === editFormData.phone || p.email === editFormData.email)
    );
    
    if (isDuplicate) {
      alert("❌ Another patient with this phone number or email already exists!");
      return;
    }
    
    updatePatient(selectedPatient.id, editFormData);
    alert(`✅ Patient ${editFormData.patientName} updated successfully!`);
    
    resetEditForm();
    setShowEditPopup(false);
    setSelectedPatient(null);
  };

  // Handle delete patient
  const handleDelete = (id) => {
    const patient = patients.find(p => p.id === id);
    
    // Check if patient has appointments or admissions
    const hasAppointments = appointments?.some(apt => apt.patientName === patient.patientName);
    const hasAdmissions = admissions?.some(adm => adm.patientName === patient.patientName);
    
    if (hasAppointments || hasAdmissions) {
      alert("❌ Cannot delete patient with existing appointments or admissions!");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${patient.patientName}'s record?`)) {
      deletePatient(id);
      alert(`✅ Patient record deleted successfully!`);
    }
  };

  // Filter patients based on search
  const filteredPatients = patients?.filter(
    (patient) => {
      if (!searchTerm) return true;
      return (
        patient.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone?.includes(searchTerm) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  ) || [];

  // Sort patients by registration date (newest first)
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const dateA = new Date(`${a.registeredDate} ${a.registeredTime}`);
    const dateB = new Date(`${b.registeredDate} ${b.registeredTime}`);
    return dateB - dateA;
  });

  // Get patient's appointment count
  const getPatientAppointmentCount = (patientName) => {
    return appointments?.filter(apt => apt.patientName === patientName).length || 0;
  };

  // Get patient's admission status
  const getPatientAdmissionStatus = (patientName) => {
    const admission = admissions?.find(adm => 
      adm.patientName === patientName && adm.status === "Admitted"
    );
    return admission ? `Bed ${admission.bedNo}` : null;
  };

  return (
    <div className="patients-page">
      {/* ==================== PAGE HEADER ==================== */}
      <div className="page-header">
        <div>
          <h1>👥 Patient Management</h1>
          <p className="page-subtitle">Register and manage patient records</p>
        </div>
        <button className="add-btn" onClick={handleAddFormOpen}>
          + Register New Patient
        </button>
      </div>

      {/* ==================== SUMMARY STATISTICS ==================== */}
      <div className="summary-stats">
        <div className="summary-card">
          <div className="summary-icon">👥</div>
          <div className="summary-info">
            <h4>Total Patients</h4>
            <p>{stats.total}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">👨</div>
          <div className="summary-info">
            <h4>Male</h4>
            <p>{stats.male}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">👩</div>
          <div className="summary-info">
            <h4>Female</h4>
            <p>{stats.female}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">🆕</div>
          <div className="summary-info">
            <h4>New This Week</h4>
            <p>{stats.newThisWeek}</p>
          </div>
        </div>
      </div>

      {/* ==================== SEARCH BAR ==================== */}
      <div className="search-container">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search patients by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ×
            </button>
          )}
        </div>
        <div className="filter-badge">
          {sortedPatients.length} patient(s) found
        </div>
      </div>

      {/* ==================== ADD PATIENT FORM ==================== */}
      {showForm && (
        <div className="booking-form-container" onClick={() => setShowForm(false)}>
          <div className="booking-form-card form-with-spacing" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>➕ Register New Patient</h3>
              <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h4>Personal Information</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="patientName"
                      placeholder="Enter full name"
                      value={formData.patientName}
                      onChange={handleChange}
                      required
                      className={errors.patientName ? "error" : ""}
                    />
                    {errors.patientName && <span className="error-message">{errors.patientName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Age <span className="required">*</span></label>
                    <input
                      type="number"
                      name="age"
                      placeholder="Age (1-120)"
                      value={formData.age}
                      onChange={handleChange}
                      min="1"
                      max="120"
                      required
                      className={errors.age ? "error" : ""}
                    />
                    {errors.age && <span className="error-message">{errors.age}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Date of Birth <span className="required">*</span></label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      required
                      className={errors.dob ? "error" : ""}
                    />
                    {errors.dob && <span className="error-message">{errors.dob}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Blood Group <span className="required">*</span></label>
                    <select 
                      name="bloodGroup" 
                      value={formData.bloodGroup} 
                      onChange={handleChange}
                      required
                      className={errors.bloodGroup ? "error" : ""}
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                    {errors.bloodGroup && <span className="error-message">{errors.bloodGroup}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Department</label>
                    <select name="department" value={formData.department} onChange={handleChange}>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Contact Information</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Mobile Number <span className="required">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="10-digit (starts with 7,8,9)"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength="10"
                      required
                      className={errors.phone ? "error" : ""}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Alternate Phone</label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      placeholder="10-digit (starts with 7,8,9)"
                      value={formData.alternatePhone}
                      onChange={handleChange}
                      maxLength="10"
                      className={errors.alternatePhone ? "error" : ""}
                    />
                    {errors.alternatePhone && <span className="error-message">{errors.alternatePhone}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={errors.email ? "error" : ""}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Residential Address</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter complete address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Medical Information</h4>
                
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Symptoms</label>
                    <div className="symptoms-dropdown">
                      <div 
                        className="symptoms-dropdown-header"
                        onClick={toggleSymptomsDropdown}
                      >
                        <span>
                          {formData.symptoms.length > 0 
                            ? `${formData.symptoms.length} symptom(s) selected`
                            : "Select symptoms..."}
                        </span>
                        <span className={`dropdown-arrow ${symptomsDropdownOpen ? 'open' : ''}`}>▼</span>
                      </div>
                      {symptomsDropdownOpen && (
                        <div className="symptoms-dropdown-menu">
                          <div className="symptoms-checkbox-grid">
                            {cardiologySymptoms.map((symptom) => (
                              <label key={symptom} className="symptoms-checkbox-item">
                                <input
                                  type="checkbox"
                                  checked={formData.symptoms.includes(symptom)}
                                  onChange={() => handleSymptomChange(symptom)}
                                />
                                <span>{symptom}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Profession</label>
                    <input
                      type="text"
                      name="profession"
                      placeholder="Enter profession"
                      value={formData.profession}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Medical History</label>
                    <input
                      type="text"
                      name="medicalHistory"
                      placeholder="Previous conditions, surgeries"
                      value={formData.medicalHistory}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Allergies</label>
                    <input
                      type="text"
                      name="allergies"
                      placeholder="Any known allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Emergency Contact</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Person Name</label>
                    <input
                      type="text"
                      name="nameOfKin"
                      placeholder="Emergency contact name"
                      value={formData.nameOfKin}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input
                      type="tel"
                      name="kinContact"
                      placeholder="10-digit number"
                      value={formData.kinContact}
                      onChange={handleChange}
                      maxLength="10"
                      className={errors.kinContact ? "error" : ""}
                    />
                    {errors.kinContact && <span className="error-message">{errors.kinContact}</span>}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="confirm-btn">
                  ✓ Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== PATIENTS TABLE ==================== */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Age/Gender</th>
              <th>Blood Group</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Registered</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPatients.length > 0 ? (
              sortedPatients.map((patient) => {
                const appointmentCount = getPatientAppointmentCount(patient.patientName);
                const admissionStatus = getPatientAdmissionStatus(patient.patientName);
                
                return (
                  <tr key={patient.id}>
                    <td>#{patient.id.slice(-6)}</td>
                    <td>
                      <div className="patient-name-cell">
                        <strong>{patient.patientName}</strong>
                      </div>
                    </td>
                    <td>{patient.age}y / {patient.gender}</td>
                    <td>
                      <span className="blood-group-badge">{patient.bloodGroup || "-"}</span>
                    </td>
                    <td>{patient.phone}</td>
                    <td>{patient.email}</td>
                    <td>
                      <div>{formatDateForDisplay(patient.registeredDate)}</div>
                      <small>{patient.registeredTime}</small>
                    </td>
                    <td>
                      {admissionStatus ? (
                        <span className="status-badge admitted">{admissionStatus}</span>
                      ) : appointmentCount > 0 ? (
                        <span className="status-badge pending">{appointmentCount} apt(s)</span>
                      ) : (
                        <span className="status-badge registered">Registered</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="view-btn" 
                          onClick={() => handleView(patient)}
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button 
                          className="edit-btn" 
                          onClick={() => handleEdit(patient)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDelete(patient.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  <div className="no-data-message">
                    <span className="no-data-icon">👥</span>
                    <p>No patients registered yet</p>
                    <button className="add-btn-small" onClick={handleAddFormOpen}>
                      Register First Patient
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ==================== VIEW POPUP ==================== */}
      {showViewPopup && selectedPatient && (
        <div className="popup-overlay" onClick={() => setShowViewPopup(false)}>
          <div className="popup-card view-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>📋 Patient Details</h2>
              <button className="close-btn" onClick={() => setShowViewPopup(false)}>×</button>
            </div>
            
            <div className="popup-content">
              <div className="detail-section">
                <h4>Personal Information</h4>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label">Patient ID:</span>
                    <span className="detail-value">{selectedPatient.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Full Name:</span>
                    <span className="detail-value">{selectedPatient.patientName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Age/Gender:</span>
                    <span className="detail-value">{selectedPatient.age} years / {selectedPatient.gender}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date of Birth:</span>
                    <span className="detail-value">{formatDateForDisplay(selectedPatient.dob)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Blood Group:</span>
                    <span className="detail-value">{selectedPatient.bloodGroup}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Department:</span>
                    <span className="detail-value">{selectedPatient.department || "Cardiology"}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Contact Information</h4>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label">Mobile:</span>
                    <span className="detail-value">{selectedPatient.phone}</span>
                  </div>
                  {selectedPatient.alternatePhone && (
                    <div className="detail-row">
                      <span className="detail-label">Alternate:</span>
                      <span className="detail-value">{selectedPatient.alternatePhone}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedPatient.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{selectedPatient.address || "-"}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Medical Information</h4>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label">Symptoms:</span>
                    <span className="detail-value">{selectedPatient.symptoms || "-"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Profession:</span>
                    <span className="detail-value">{selectedPatient.profession || "-"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Medical History:</span>
                    <span className="detail-value">{selectedPatient.medicalHistory || "-"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Allergies:</span>
                    <span className="detail-value">{selectedPatient.allergies || "-"}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Emergency Contact</h4>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label">Contact Person:</span>
                    <span className="detail-value">{selectedPatient.nameOfKin || "-"}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Contact Number:</span>
                    <span className="detail-value">{selectedPatient.kinContact || "-"}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Registration Details</h4>
                <div className="detail-grid">
                  <div className="detail-row">
                    <span className="detail-label">Registered On:</span>
                    <span className="detail-value">
                      {formatDateForDisplay(selectedPatient.registeredDate)} at {selectedPatient.registeredTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="popup-actions">
              <button 
                className="edit-btn" 
                onClick={() => {
                  setShowViewPopup(false);
                  handleEdit(selectedPatient);
                }}
              >
                ✏️ Edit Patient
              </button>
              <button className="cancel-btn" onClick={() => setShowViewPopup(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ✅ FIXED: EDIT POPUP WITH FULL FORM ==================== */}
      {showEditPopup && selectedPatient && (
        <div className="booking-form-container" onClick={() => setShowEditPopup(false)}>
          <div className="booking-form-card form-with-spacing" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>✏️ Edit Patient - {selectedPatient.patientName}</h3>
              <button className="close-btn" onClick={() => setShowEditPopup(false)}>×</button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-section">
                <h4>Personal Information</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="patientName"
                      placeholder="Enter full name"
                      value={editFormData.patientName}
                      onChange={handleEditChange}
                      required
                      className={editErrors.patientName ? "error" : ""}
                    />
                    {editErrors.patientName && <span className="error-message">{editErrors.patientName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Age <span className="required">*</span></label>
                    <input
                      type="number"
                      name="age"
                      placeholder="Age (1-120)"
                      value={editFormData.age}
                      onChange={handleEditChange}
                      min="1"
                      max="120"
                      required
                      className={editErrors.age ? "error" : ""}
                    />
                    {editErrors.age && <span className="error-message">{editErrors.age}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={editFormData.gender} onChange={handleEditChange}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Date of Birth <span className="required">*</span></label>
                    <input
                      type="date"
                      name="dob"
                      value={editFormData.dob}
                      onChange={handleEditChange}
                      max={new Date().toISOString().split('T')[0]}
                      required
                      className={editErrors.dob ? "error" : ""}
                    />
                    {editErrors.dob && <span className="error-message">{editErrors.dob}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Blood Group <span className="required">*</span></label>
                    <select 
                      name="bloodGroup" 
                      value={editFormData.bloodGroup} 
                      onChange={handleEditChange}
                      required
                      className={editErrors.bloodGroup ? "error" : ""}
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                    {editErrors.bloodGroup && <span className="error-message">{editErrors.bloodGroup}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Department</label>
                    <select name="department" value={editFormData.department} onChange={handleEditChange}>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Contact Information</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Mobile Number <span className="required">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="10-digit (starts with 7,8,9)"
                      value={editFormData.phone}
                      onChange={handleEditChange}
                      maxLength="10"
                      required
                      className={editErrors.phone ? "error" : ""}
                    />
                    {editErrors.phone && <span className="error-message">{editErrors.phone}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Alternate Phone</label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      placeholder="10-digit (starts with 7,8,9)"
                      value={editFormData.alternatePhone}
                      onChange={handleEditChange}
                      maxLength="10"
                      className={editErrors.alternatePhone ? "error" : ""}
                    />
                    {editErrors.alternatePhone && <span className="error-message">{editErrors.alternatePhone}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      required
                      className={editErrors.email ? "error" : ""}
                    />
                    {editErrors.email && <span className="error-message">{editErrors.email}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Residential Address</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter complete address"
                      value={editFormData.address}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Medical Information</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Profession</label>
                    <input
                      type="text"
                      name="profession"
                      placeholder="Enter profession"
                      value={editFormData.profession}
                      onChange={handleEditChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Medical History</label>
                    <input
                      type="text"
                      name="medicalHistory"
                      placeholder="Previous conditions, surgeries"
                      value={editFormData.medicalHistory}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Allergies</label>
                    <input
                      type="text"
                      name="allergies"
                      placeholder="Any known allergies"
                      value={editFormData.allergies}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Emergency Contact</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Person Name</label>
                    <input
                      type="text"
                      name="nameOfKin"
                      placeholder="Emergency contact name"
                      value={editFormData.nameOfKin}
                      onChange={handleEditChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input
                      type="tel"
                      name="kinContact"
                      placeholder="10-digit number"
                      value={editFormData.kinContact}
                      onChange={handleEditChange}
                      maxLength="10"
                      className={editErrors.kinContact ? "error" : ""}
                    />
                    {editErrors.kinContact && <span className="error-message">{editErrors.kinContact}</span>}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowEditPopup(false)}>
                  Cancel
                </button>
                <button type="submit" className="confirm-btn">
                  ✓ Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Patients;