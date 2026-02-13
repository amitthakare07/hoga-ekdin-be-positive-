import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./AdmitPatientForm.css";

function AdmitPatientForm() {
  const navigate = useNavigate();
  const context = useOutletContext();
  // Destructure safely to avoid errors if context is incomplete
  const { addAdmission, getAvailableBeds, searchPatients } = context || {};

  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    age: "",
    gender: "Male",
    address: "",
    phone: "",
    nameOfKin: "",
    kinContact: "",
    bedNo: "",
    fromDate: new Date().toISOString().split('T')[0],
    toDate: "",
    symptoms: [],
    admittingDoctor: ""
  });

  const [errors, setErrors] = useState({});
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);
  const [availableBedsList, setAvailableBedsList] = useState([]);

  useEffect(() => {
    if (getAvailableBeds) {
      setAvailableBedsList(getAvailableBeds());
    }
  }, [getAvailableBeds]);

  const cardiologySymptoms = [
    "Chest Pain", "Shortness of Breath", "Palpitations",
    "High Blood Pressure", "Dizziness", "Fatigue",
    "Swelling in Legs", "Irregular Heartbeat"
  ];

  const getMinDate = () => new Date().toISOString().split('T')[0];

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

  const validateDate = (date) => {
    if (!date) return false;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  // Ensure bed number is in correct format (e.g., B1, B2)
  const formatBedNo = (bed) => {
    if (!bed) return "";
    const match = bed.match(/^[bB]?(\d+)$/);
    return match ? `B${match[1]}` : bed;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateName(formData.patientName))
      newErrors.patientName = "Patient name must be between 2-50 characters";
    if (!validateAge(formData.age))
      newErrors.age = "Age must be between 1-120 years";
    if (!validatePhone(formData.phone))
      newErrors.phone = "Enter valid 10-digit number starting with 7,8,9";
    if (formData.kinContact && !validatePhone(formData.kinContact))
      newErrors.kinContact = "Enter valid 10-digit emergency contact number";

    const formattedBed = formatBedNo(formData.bedNo);
    if (!formattedBed)
      newErrors.bedNo = "Please select a bed number";
    else if (!availableBedsList.includes(formattedBed))
      newErrors.bedNo = "Selected bed is not available";

    if (!validateDate(formData.fromDate))
      newErrors.fromDate = "Admission date cannot be in the past";
    if (formData.toDate && formData.toDate < formData.fromDate)
      newErrors.toDate = "Discharge date cannot be before admission date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "kinContact") {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 10) setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else if (name === "age") {
      if (value === "" || /^\d+$/.test(value)) {
        const ageNum = parseInt(value);
        if (value === "" || (ageNum >= 0 && ageNum <= 120))
          setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === "patientName") {
      setFormData(prev => ({ ...prev, [name]: value }));

      if (value.length >= 2 && searchPatients) {
        const results = searchPatients(value);
        setFilteredPatients(results);
        setShowPatientSuggestions(results.length > 0);
      } else {
        setShowPatientSuggestions(false);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSymptomChange = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const selectPatient = (patient) => {
    setFormData(prev => ({
      ...prev,
      patientName: patient.patientName,
      patientId: patient.id,
      age: patient.age,
      gender: patient.gender,
      address: patient.address || "",
      phone: patient.phone,
      nameOfKin: patient.nameOfKin || "",
      kinContact: patient.kinContact || "",
    }));
    setShowPatientSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submissionData = {
      ...formData,
      bedNo: formatBedNo(formData.bedNo),
    };

    if (addAdmission) {
      addAdmission(submissionData);
      alert(`✅ Patient ${formData.patientName} admitted to Bed ${submissionData.bedNo}`);
      // Use setTimeout to ensure state is updated before navigation
      setTimeout(() => {
        navigate("/receptionist-dashboard/bedview");
      }, 100);
    } else {
      console.error("addAdmission function not available in context");
      alert("Error: Admission function not available");
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h3>🏥 Admit Patient</h3>
          <button className="close-btn" onClick={() => navigate(-1)}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <datalist id="bed-numbers">
            {availableBedsList.map((bed, i) => <option key={i} value={bed} />)}
          </datalist>

          <div className="form-section">
            <h4>Patient Information</h4>
            <div className="form-group patient-search-container">
              <label>Patient Name *</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Search or enter patient name"
                required
                className={errors.patientName ? "error" : ""}
                autoComplete="off"
              />
              {errors.patientName && <span className="error-message">{errors.patientName}</span>}

              {showPatientSuggestions && filteredPatients.length > 0 && (
                <div className="patient-suggestions">
                  {filteredPatients.map(patient => (
                    <div
                      key={patient.id}
                      className="patient-suggestion-item"
                      onClick={() => selectPatient(patient)}
                    >
                      <strong>{patient.patientName}</strong>
                      <span>Age: {patient.age} | Phone: {patient.phone}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age (1-120)"
                  min="1"
                  max="120"
                  required
                  className={errors.age ? "error" : ""}
                />
                {errors.age && <span className="error-message">{errors.age}</span>}
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  maxLength="10"
                  required
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Emergency Contact Name</label>
                <input
                  type="text"
                  name="nameOfKin"
                  value={formData.nameOfKin}
                  onChange={handleChange}
                  placeholder="Contact name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Emergency Contact *</label>
                <input
                  type="tel"
                  name="kinContact"
                  value={formData.kinContact}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  maxLength="10"
                  required
                  className={errors.kinContact ? "error" : ""}
                />
                {errors.kinContact && <span className="error-message">{errors.kinContact}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Admission Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Bed Number *</label>
                <input
                  type="text"
                  name="bedNo"
                  value={formData.bedNo}
                  onChange={handleChange}
                  placeholder="Select bed number (e.g., B1)"
                  list="bed-numbers"
                  required
                  className={errors.bedNo ? "error" : ""}
                />
                {errors.bedNo && <span className="error-message">{errors.bedNo}</span>}
                <small className="field-hint">Available beds: {availableBedsList.length}</small>
              </div>
              <div className="form-group">
                <label>Admission Date *</label>
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  min={getMinDate()}
                  required
                  className={errors.fromDate ? "error" : ""}
                />
                {errors.fromDate && <span className="error-message">{errors.fromDate}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expected Discharge Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  min={formData.fromDate || getMinDate()}
                  className={errors.toDate ? "error" : ""}
                />
                {errors.toDate && <span className="error-message">{errors.toDate}</span>}
              </div>
              <div className="form-group">
                <label>Admitting Doctor</label>
                <input
                  type="text"
                  name="admittingDoctor"
                  value={formData.admittingDoctor}
                  onChange={handleChange}
                  placeholder="Doctor name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Symptoms (Optional)</label>
                <div className="symptoms-checkbox-grid">
                  {cardiologySymptoms.map((symptom) => (
                    <label key={symptom} className="symptom-checkbox-label">
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
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="confirm-btn">✓ Admit Patient</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdmitPatientForm;