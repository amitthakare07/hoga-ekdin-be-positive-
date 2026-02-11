import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ==================== CONTEXTS ====================
const AppointmentsContext = React.createContext();
const PatientsContext = React.createContext();
const AdmissionsContext = React.createContext();

// Custom hooks
const useAppointments = () => React.useContext(AppointmentsContext);
const usePatients = () => React.useContext(PatientsContext);
const useAdmissions = () => React.useContext(AdmissionsContext);

// ==================== APPOINTMENTS PROVIDER ====================
function AppointmentsProvider({ children }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('appointments');
    if (saved) setAppointments(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = (appointment) => {
    const newAppointment = {
      id: `APT-${Date.now()}`,
      ...appointment,
      status: appointment.status || "Pending"
    };
    setAppointments(prev => [...prev, newAppointment]);
    console.log("✅ Appointment Added:", newAppointment);
    return newAppointment;
  };

  const updateAppointment = (id, updatedData) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, ...updatedData } : apt));
  };

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  return (
    <AppointmentsContext.Provider value={{ 
      appointments, 
      addAppointment, 
      updateAppointment, 
      deleteAppointment 
    }}>
      {children}
    </AppointmentsContext.Provider>
  );
}

// ==================== PATIENTS PROVIDER ====================
function PatientsProvider({ children }) {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('patients');
    if (saved) setPatients(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  const addPatient = (patient) => {
    const newPatient = { id: `PAT-${Date.now()}`, ...patient };
    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  };

  const updatePatient = (id, updatedData) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deletePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const searchPatients = (query) => {
    if (!query) return [];
    return patients.filter(p => 
      p.patientName?.toLowerCase().includes(query.toLowerCase()) ||
      p.phone?.includes(query)
    );
  };

  return (
    <PatientsContext.Provider value={{ 
      patients, 
      addPatient, 
      updatePatient, 
      deletePatient, 
      searchPatients 
    }}>
      {children}
    </PatientsContext.Provider>
  );
}

// ==================== ADMISSIONS PROVIDER ====================
function AdmissionsProvider({ children }) {
  const [admissions, setAdmissions] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('admissions');
    if (saved) setAdmissions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('admissions', JSON.stringify(admissions));
  }, [admissions]);

  const addAdmission = (admission) => {
    const newAdmission = { id: `ADM-${Date.now()}`, ...admission };
    setAdmissions(prev => [...prev, newAdmission]);
    return newAdmission;
  };

  const updateAdmission = (id, updatedData) => {
    setAdmissions(prev => prev.map(adm => adm.id === id ? { ...adm, ...updatedData } : adm));
  };

  const dischargePatient = (id) => {
    setAdmissions(prev => prev.map(adm => 
      adm.id === id ? { ...adm, status: "Discharged", dischargeDate: new Date().toISOString().split('T')[0] } : adm
    ));
  };

  const getAvailableBeds = (allBeds) => {
    const occupied = admissions.filter(adm => adm.status === "Admitted").map(adm => adm.bedNo);
    return allBeds.filter(bed => !occupied.includes(bed));
  };

  return (
    <AdmissionsContext.Provider value={{ 
      admissions, 
      addAdmission, 
      updateAdmission, 
      dischargePatient, 
      getAvailableBeds 
    }}>
      {children}
    </AdmissionsContext.Provider>
  );
}

// ==================== DASHBOARD HOME PAGE ====================
function DashboardHome() {
  const navigate = useNavigate();
  const { appointments, addAppointment } = useAppointments();
  const { patients, addPatient, searchPatients } = usePatients();
  const { admissions, addAdmission, getAvailableBeds } = useAdmissions();

  // ==================== STATE ====================
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [errors, setErrors] = useState({});
  const [symptomsDropdownOpen, setSymptomsDropdownOpen] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);
  
  // Available bed numbers
  const availableBeds = [
    "101", "102", "103", "104", "105",
    "201", "202", "203", "204", "205",
    "301", "302", "303", "304", "305",
    "ICU-1", "ICU-2", "ICU-3", "ICU-4", "ICU-5",
  ];

  // Cardiology symptoms
  const cardiologySymptoms = [
    "Chest Pain", "Shortness of Breath", "Palpitations", 
    "High Blood Pressure", "Dizziness", "Fatigue", 
    "Swelling in Legs", "Irregular Heartbeat",
    "Nausea", "Sweating", "Pain in Arms", "Jaw Pain",
    "Lightheadedness", "Rapid Heartbeat", "Slow Heartbeat",
    "Chest Discomfort", "Coughing", "Ankle Swelling",
    "Bluish Skin", "Fainting", "Confusion"
  ];

  // Blood groups
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  // Helper functions
  const getMinDate = () => new Date().toISOString().split('T')[0];

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
  };

  // Form states
  const [appointmentFormData, setAppointmentFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    phone: "",
    symptoms: [],
    date: getCurrentDateTime().date,
    time: "",
    status: "Pending",
    type: "Cardiology",
    doctor: "Dr. Sharma",
    notes: ""
  });

  const [patientFormData, setPatientFormData] = useState({
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
    registeredDate: getCurrentDateTime().date,
    registeredTime: getCurrentDateTime().time,
  });

  const [admitFormData, setAdmitFormData] = useState({
    patientName: "",
    patientId: "",
    age: "",
    gender: "Male",
    address: "",
    phone: "",
    nameOfKin: "",
    kinContact: "",
    bedNo: "",
    fromDate: getCurrentDateTime().date,
    toDate: "",
    symptoms: [],
    admittingDoctor: "",
  });

  // Get available beds dynamically
  const [availableBedsList, setAvailableBedsList] = useState(availableBeds);
  
  useEffect(() => {
    if (admissions) {
      const occupiedBeds = admissions
        .filter(adm => adm.status === "Admitted")
        .map(adm => adm.bedNo);
      setAvailableBedsList(availableBeds.filter(bed => !occupiedBeds.includes(bed)));
    }
  }, [admissions]);

  // ==================== VALIDATION FUNCTIONS ====================
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
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

  const calculateAgeFromDOB = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age.toString();
  };

  // Appointment form validation
  const validateAppointmentForm = () => {
    const newErrors = {};
    
    if (!validateName(appointmentFormData.patientName)) 
      newErrors.patientName = "Patient name must be between 2-50 characters";
    
    if (!validateAge(appointmentFormData.age)) 
      newErrors.age = "Age must be between 1-120 years";
    
    if (!appointmentFormData.gender) 
      newErrors.gender = "Please select gender";
    
    if (!validatePhone(appointmentFormData.phone)) 
      newErrors.phone = "Enter valid 10-digit number starting with 7,8,9";
    
    if (!validateDate(appointmentFormData.date)) 
      newErrors.date = "Appointment date cannot be in the past";
    
    if (!appointmentFormData.time) 
      newErrors.time = "Please select appointment time";
    else if (appointmentFormData.date === getCurrentDateTime().date) {
      if (appointmentFormData.time < getCurrentDateTime().time)
        newErrors.time = "Appointment time cannot be in the past";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Patient form validation
  const validatePatientForm = () => {
    const newErrors = {};
    
    if (!validateName(patientFormData.patientName)) 
      newErrors.patientName = "Patient name must be between 2-50 characters";
    
    if (!validateAge(patientFormData.age)) 
      newErrors.age = "Age must be between 1-120 years";
    
    if (!patientFormData.dob) 
      newErrors.dob = "Date of birth is required";
    else {
      const age = parseInt(patientFormData.age);
      const calculatedAge = parseInt(calculateAgeFromDOB(patientFormData.dob));
      if (age !== calculatedAge) newErrors.dob = "Age doesn't match date of birth";
    }
    
    if (!validatePhone(patientFormData.phone)) 
      newErrors.phone = "Enter valid 10-digit number starting with 7,8,9";
    
    if (patientFormData.alternatePhone && !validatePhone(patientFormData.alternatePhone))
      newErrors.alternatePhone = "Enter valid 10-digit number starting with 7,8,9";
    
    if (!validateEmail(patientFormData.email)) 
      newErrors.email = "Enter valid email address";
    
    if (!patientFormData.bloodGroup) 
      newErrors.bloodGroup = "Please select blood group";
    
    if (patientFormData.kinContact && !validatePhone(patientFormData.kinContact)) 
      newErrors.kinContact = "Enter valid 10-digit emergency contact number";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Admit form validation
  const validateAdmitForm = () => {
    const newErrors = {};
    
    if (!validateName(admitFormData.patientName)) 
      newErrors.patientName = "Patient name must be between 2-50 characters";
    
    if (!validateAge(admitFormData.age)) 
      newErrors.age = "Age must be between 1-120 years";
    
    if (!validatePhone(admitFormData.phone)) 
      newErrors.phone = "Enter valid 10-digit number starting with 7,8,9";
    
    if (admitFormData.kinContact && !validatePhone(admitFormData.kinContact)) 
      newErrors.kinContact = "Enter valid 10-digit emergency contact number";
    
    if (!admitFormData.bedNo) 
      newErrors.bedNo = "Please select a bed number";
    else if (!availableBedsList.includes(admitFormData.bedNo)) 
      newErrors.bedNo = "Selected bed is not available";
    
    if (!validateDate(admitFormData.fromDate)) 
      newErrors.fromDate = "Admission date cannot be in the past";
    
    if (admitFormData.toDate && admitFormData.toDate < admitFormData.fromDate)
      newErrors.toDate = "Discharge date cannot be before admission date";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== HANDLERS ====================
  const openPopup = (type) => {
    setPopupType(type);
    setShowPopup(true);
    setErrors({});
    setSymptomsDropdownOpen(false);
    setShowPatientSuggestions(false);
    
    if (type === "appointment") {
      setAppointmentFormData({
        patientName: "", age: "", gender: "", phone: "", symptoms: [],
        date: getCurrentDateTime().date, time: "", status: "Pending", type: "Cardiology",
        doctor: "Dr. Sharma", notes: ""
      });
    } else if (type === "patient") {
      setPatientFormData({
        patientName: "", age: "", gender: "Male", dob: "", email: "", phone: "",
        alternatePhone: "", address: "", symptoms: [], bloodGroup: "", profession: "",
        nameOfKin: "", kinContact: "", registeredDate: getCurrentDateTime().date,
        registeredTime: getCurrentDateTime().time,
      });
    } else if (type === "admit") {
      setAdmitFormData({
        patientName: "", patientId: "", age: "", gender: "Male", address: "", phone: "",
        nameOfKin: "", kinContact: "", bedNo: "", fromDate: getCurrentDateTime().date,
        toDate: "", symptoms: [], admittingDoctor: "",
      });
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupType("");
    setErrors({});
    setSymptomsDropdownOpen(false);
    setShowPatientSuggestions(false);
  };

  // Name suggestion handler
  const handleNameSearch = (value) => {
    if (value.length >= 2) {
      const results = searchPatients(value);
      setFilteredPatients(results);
      setShowPatientSuggestions(results.length > 0);
    } else {
      setShowPatientSuggestions(false);
    }
  };

  const selectPatient = (patient) => {
    setAdmitFormData({
      ...admitFormData,
      patientName: patient.patientName,
      patientId: patient.id,
      age: patient.age,
      gender: patient.gender,
      address: patient.address || "",
      phone: patient.phone,
      nameOfKin: patient.nameOfKin || "",
      kinContact: patient.kinContact || "",
    });
    setShowPatientSuggestions(false);
  };

  // ==================== APPOINTMENT HANDLERS ====================
  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 10) setAppointmentFormData(prev => ({ ...prev, [name]: cleaned }));
    } else if (name === "age") {
      if (value === "" || /^\d+$/.test(value)) {
        const ageNum = parseInt(value);
        if (value === "" || (ageNum >= 0 && ageNum <= 120))
          setAppointmentFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setAppointmentFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleAppointmentSymptomChange = (symptom) => {
    setAppointmentFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  // ✅ MAIN APPOINTMENT SUBMIT HANDLER - FIXED
  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    
    if (!validateAppointmentForm()) {
      return;
    }
    
    // Duplicate check
    const isDuplicate = appointments?.some(apt => 
      apt.date === appointmentFormData.date &&
      apt.time === appointmentFormData.time
    );
    
    if (isDuplicate) {
      alert("❌ This time slot is already booked!");
      return;
    }
    
    // Prepare appointment data
    const appointmentData = {
      patientName: appointmentFormData.patientName,
      age: appointmentFormData.age,
      gender: appointmentFormData.gender,
      phone: appointmentFormData.phone,
      symptoms: appointmentFormData.symptoms.join(", "),
      date: appointmentFormData.date,
      time: appointmentFormData.time,
      type: "Cardiology",
      doctor: "Dr. Sharma",
      status: "Pending",
      notes: appointmentFormData.notes || "",
      bookingDate: getCurrentDateTime().date,
      bookingTime: getCurrentDateTime().time,
    };
    
    // Add to context
    addAppointment(appointmentData);
    
    alert(`✅ Appointment booked successfully for ${appointmentData.patientName}!`);
    
    closePopup();
    
    // Redirect to Appointments page
    navigate("/receptionist-dashboard/appointments");
  };

  // ==================== PATIENT HANDLERS ====================
  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "dob") {
      const age = calculateAgeFromDOB(value);
      setPatientFormData(prev => ({ ...prev, dob: value, age: age }));
    } else if (name === "age") {
      if (value === "" || /^\d+$/.test(value)) {
        const ageNum = parseInt(value);
        if (value === "" || (ageNum >= 0 && ageNum <= 120))
          setPatientFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (["phone", "alternatePhone", "kinContact"].includes(name)) {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 10) setPatientFormData(prev => ({ ...prev, [name]: cleaned }));
    } else {
      setPatientFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handlePatientSymptomChange = (symptom) => {
    setPatientFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handlePatientSubmit = (e) => {
    e.preventDefault();
    
    if (!validatePatientForm()) return;
    
    const isDuplicate = patients?.some(p => 
      p.phone === patientFormData.phone || p.email === patientFormData.email
    );
    
    if (isDuplicate) {
      alert("❌ Patient with this phone or email already exists!");
      return;
    }
    
    const patientData = {
      ...patientFormData,
      symptoms: patientFormData.symptoms.join(", "),
      registeredDate: getCurrentDateTime().date,
      registeredTime: getCurrentDateTime().time,
    };
    
    addPatient(patientData);
    alert(`✅ Patient ${patientData.patientName} registered successfully!`);
    closePopup();
  };

  // ==================== ADMIT HANDLERS ====================
  const handleAdmitChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone" || name === "kinContact") {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 10) setAdmitFormData(prev => ({ ...prev, [name]: cleaned }));
    } else if (name === "age") {
      if (value === "" || /^\d+$/.test(value)) {
        const ageNum = parseInt(value);
        if (value === "" || (ageNum >= 0 && ageNum <= 120))
          setAdmitFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === "patientName") {
      setAdmitFormData(prev => ({ ...prev, [name]: value }));
      handleNameSearch(value);
    } else {
      setAdmitFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleAdmitSymptomChange = (symptom) => {
    setAdmitFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleAdmitSubmit = (e) => {
    e.preventDefault();
    
    if (!validateAdmitForm()) return;
    
    const admitData = {
      ...admitFormData,
      symptoms: admitFormData.symptoms.join(", "),
      admissionDate: getCurrentDateTime().date,
      admissionTime: getCurrentDateTime().time,
      status: "Admitted",
    };
    
    addAdmission(admitData);
    alert(`✅ Patient ${admitData.patientName} admitted to Bed ${admitData.bedNo}`);
    closePopup();
    navigate("/receptionist-dashboard/admit-patients");
  };

  // ==================== STATISTICS ====================
  const stats = [
    { label: "Total Appointments", value: appointments?.length || 0, icon: "📅", color: "#1976d2" },
    { label: "Today's Appointments", value: appointments?.filter(a => a.date === getCurrentDateTime().date).length || 0, icon: "🗓️", color: "#388e3c" },
    { label: "Registered Patients", value: patients?.length || 0, icon: "👥", color: "#f57c00" },
    { label: "Admitted Patients", value: admissions?.filter(a => a.status === "Admitted").length || 0, icon: "🛏️", color: "#d32f2f" },
    { label: "Available Beds", value: availableBedsList.length, icon: "🛏️", color: "#2e7d32" }
  ];

  // Recent activities
  const recentActivities = [
    ...(appointments?.slice(-3).map(apt => ({
      time: `${apt.date} ${apt.time}`,
      activity: `Appointment booked for ${apt.patientName}`,
      type: "appointment"
    })) || []),
    ...(patients?.slice(-3).map(pat => ({
      time: `${pat.registeredDate} ${pat.registeredTime}`,
      activity: `New patient registered: ${pat.patientName}`,
      type: "registration"
    })) || []),
    ...(admissions?.slice(-3).map(adm => ({
      time: `${adm.admissionDate} ${adm.admissionTime}`,
      activity: `Patient admitted: ${adm.patientName} (Bed ${adm.bedNo})`,
      type: "admission"
    })) || [])
  ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5);

  // ==================== RENDER WITH FULL CSS ====================
  return (
    <>
      <style>{`
        /* ==================== DASHBOARD HOME CSS ==================== */
        .dashboard-home {
          padding: 30px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          background-color: #f8fafc;
          min-height: 100vh;
        }

        /* ==================== HEADER ==================== */
        .dashboard-header {
          margin-bottom: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          color: white;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
        }

        .dashboard-header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .dashboard-header .subtitle {
          margin: 10px 0 0;
          font-size: 16px;
          opacity: 0.95;
        }

        /* ==================== STATS GRID ==================== */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          display: flex;
          align-items: center;
          box-shadow: 0 5px 20px rgba(0,0,0,0.03);
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.03);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }

        .stat-icon {
          font-size: 48px;
          margin-right: 20px;
        }

        .stat-info h3 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-info p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ==================== QUICK ACTIONS ==================== */
        .quick-actions-section {
          margin-bottom: 40px;
        }

        .quick-actions-section h2 {
          font-size: 24px;
          color: #1e293b;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .action-btn {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px 25px;
          display: flex;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
          font-weight: 500;
          color: #1e293b;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }

        .action-btn:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(102, 126, 234, 0.3);
        }

        .action-icon {
          font-size: 24px;
        }

        /* ==================== RECENT ACTIVITIES ==================== */
        .recent-activities-section {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.03);
          border: 1px solid #e2e8f0;
        }

        .recent-activities-section h2 {
          font-size: 20px;
          color: #1e293b;
          margin: 0 0 20px;
          font-weight: 600;
        }

        .activities-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          background: #f8fafc;
          border-radius: 10px;
          transition: all 0.2s ease;
          border: 1px solid #e2e8f0;
        }

        .activity-item:hover {
          background: white;
          border-color: #667eea;
        }

        .activity-time {
          min-width: 140px;
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
        }

        .activity-text {
          flex: 1;
          color: #1e293b;
          font-weight: 500;
        }

        .activity-type {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .activity-type.appointment { 
          background: #e0f2fe; 
          color: #0369a1; 
          border: 1px solid #b8e1fc;
        }
        .activity-type.registration { 
          background: #dcfce7; 
          color: #166534; 
          border: 1px solid #bbf7d0;
        }
        .activity-type.admission { 
          background: #fff3cd; 
          color: #856404; 
          border: 1px solid #ffe69c;
        }

        .no-activities {
          text-align: center;
          padding: 50px;
          color: #64748b;
          background: #f8fafc;
          border-radius: 10px;
          border: 2px dashed #e2e8f0;
        }

        /* ==================== POPUP CONTAINER ==================== */
        .booking-form-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .booking-form-card {
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 700px;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0,0,0,0.3);
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .booking-form-card::-webkit-scrollbar {
          width: 8px;
        }

        .booking-form-card::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .booking-form-card::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .booking-form-card::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* ==================== FORM HEADER ==================== */
        .form-header {
          padding: 25px 30px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px 20px 0 0;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .form-header h3 {
          margin: 0;
          color: white;
          font-size: 22px;
          font-weight: 600;
        }

        .close-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: white;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: rotate(90deg);
        }

        /* ==================== FORM SECTIONS ==================== */
        form {
          padding: 30px;
        }

        .form-section {
          margin-bottom: 30px;
          padding-bottom: 30px;
          border-bottom: 2px solid #f1f5f9;
        }

        .form-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .form-section h4 {
          margin: 0 0 20px;
          color: #1e293b;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-section h4:before {
          content: '';
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
        }

        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          flex: 1;
          position: relative;
        }

        .form-group.full-width {
          flex: 0 0 100%;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        input, select, textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          transition: all 0.2s ease;
          background: white;
          color: #1e293b;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        input.error, select.error, textarea.error {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .error-message {
          color: #ef4444;
          font-size: 12px;
          margin-top: 6px;
          display: block;
          font-weight: 500;
        }

        .read-only {
          background: #f8fafc;
          border-color: #e2e8f0;
          color: #475569;
          cursor: not-allowed;
        }

        .field-hint {
          display: block;
          color: #64748b;
          font-size: 12px;
          margin-top: 6px;
          font-style: italic;
        }

        /* ==================== SYMPTOMS DROPDOWN ==================== */
        .symptoms-container {
          position: relative;
        }

        .symptoms-select-box {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          background: white;
          transition: all 0.2s ease;
        }

        .symptoms-select-box:hover {
          border-color: #667eea;
        }

        .selected-symptoms-preview {
          flex: 1;
        }

        .selected-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .symptom-chip {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .chip-remove {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          cursor: pointer;
          padding: 0;
          font-size: 18px;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .chip-remove:hover {
          background: rgba(255,255,255,0.3);
          transform: scale(1.1);
        }

        .more-count {
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
        }

        .placeholder {
          color: #94a3b8;
        }

        .dropdown-arrow {
          color: #64748b;
          transition: transform 0.3s ease;
          font-size: 14px;
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        .symptoms-dropdown-menu {
          position: absolute;
          top: calc(100% + 5px);
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          margin-top: 5px;
          padding: 15px;
          z-index: 1000;
          max-height: 280px;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .symptom-option {
          display: flex;
          align-items: center;
          padding: 10px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .symptom-option:hover {
          background: #f1f5f9;
        }

        .symptom-option input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin-right: 12px;
          accent-color: #667eea;
        }

        .checkbox-label {
          font-size: 14px;
          color: #1e293b;
        }

        .symptoms-checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 10px;
        }

        .symptoms-checkbox-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .symptoms-checkbox-item:hover {
          background: #e2e8f0;
        }

        /* ==================== PATIENT SUGGESTIONS ==================== */
        .patient-search-container {
          position: relative;
        }

        .patient-suggestions {
          position: absolute;
          top: calc(100% + 5px);
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          margin-top: 5px;
          max-height: 250px;
          overflow-y: auto;
          z-index: 1001;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .patient-suggestion-item {
          padding: 15px;
          cursor: pointer;
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s ease;
        }

        .patient-suggestion-item:last-child {
          border-bottom: none;
        }

        .patient-suggestion-item:hover {
          background: #f1f5f9;
        }

        .patient-suggestion-item strong {
          display: block;
          color: #1e293b;
          margin-bottom: 5px;
          font-size: 15px;
        }

        .patient-suggestion-item span {
          font-size: 13px;
          color: #64748b;
        }

        /* ==================== FORM ACTIONS ==================== */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #f1f5f9;
        }

        .cancel-btn, .confirm-btn {
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          letter-spacing: 0.5px;
        }

        .cancel-btn {
          background: white;
          border: 2px solid #e2e8f0;
          color: #64748b;
        }

        .cancel-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          transform: translateY(-2px);
        }

        .confirm-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .confirm-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
        }

        /* ==================== RESPONSIVE DESIGN ==================== */
        @media (max-width: 768px) {
          .dashboard-home {
            padding: 20px;
          }

          .dashboard-header h1 {
            font-size: 24px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }

          .form-row {
            flex-direction: column;
            gap: 15px;
          }

          .booking-form-card {
            margin: 10px;
          }

          .form-header h3 {
            font-size: 18px;
          }

          .activity-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .activity-time {
            min-width: auto;
          }
        }

        /* ==================== ANIMATIONS ==================== */
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .action-btn:active {
          animation: pulse 0.2s ease;
        }

        /* ==================== CUSTOM SCROLLBAR ==================== */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
          border: 2px solid #f1f5f9;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* ==================== LOADING STATES ==================== */
        .loading {
          position: relative;
          pointer-events: none;
          opacity: 0.7;
        }

        .loading:after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          margin: -10px 0 0 -10px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="dashboard-home">
        {/* ==================== PAGE HEADER ==================== */}
        <div className="dashboard-header">
          <h1>Welcome to Reception</h1>
          <p className="subtitle">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>

        {/* ==================== STATISTICS CARDS ==================== */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ==================== QUICK ACTIONS SECTION ==================== */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => openPopup("appointment")}>
              <span className="action-icon">📅</span>
              <span>Book Appointment</span>
            </button>
            <button className="action-btn" onClick={() => openPopup("patient")}>
              <span className="action-icon">➕</span>
              <span>Add New Patient</span>
            </button>
            <button className="action-btn" onClick={() => openPopup("admit")}>
              <span className="action-icon">🏥</span>
              <span>Admit Patient</span>
            </button>
            <button className="action-btn" onClick={() => navigate("/receptionist-dashboard/facilities")}>
              <span className="action-icon">🏢</span>
              <span>Available Facilities</span>
            </button>
          </div>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => navigate("/receptionist-dashboard/appointments")}>
              <span className="action-icon">📋</span>
              <span>Appointment List</span>
            </button>
            <button className="action-btn" onClick={() => navigate("/receptionist-dashboard/patients")}>
              <span className="action-icon">👥</span>
              <span>All Patient List</span>
            </button>
            <button className="action-btn" onClick={() => navigate("/receptionist-dashboard/admit-patients")}>
              <span className="action-icon">🛏️</span>
              <span>Admitted List</span>
            </button>
            <button className="action-btn" onClick={() => navigate("/receptionist-dashboard/laboratory")}>
              <span className="action-icon">🔬</span>
              <span>Laboratory Details</span>
            </button>
          </div>
        </div>

        {/* ==================== RECENT ACTIVITIES SECTION ==================== */}
        <div className="recent-activities-section">
          <h2>Recent Activities</h2>
          <div className="activities-list">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-time">{activity.time}</span>
                  <span className="activity-text">{activity.activity}</span>
                  <span className={`activity-type ${activity.type}`}>{activity.type}</span>
                </div>
              ))
            ) : (
              <div className="no-activities">
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== BOOK APPOINTMENT POPUP ==================== */}
      {showPopup && popupType === "appointment" && (
        <div className="booking-form-container" onClick={closePopup}>
          <div className="booking-form-card" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>📅 Book Appointment</h3>
              <button className="close-btn" onClick={closePopup}>×</button>
            </div>
            <form onSubmit={handleAppointmentSubmit}>
              <div className="form-section">
                <h4>Patient Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Patient Name *</label>
                    <input
                      type="text"
                      name="patientName"
                      value={appointmentFormData.patientName}
                      onChange={handleAppointmentChange}
                      placeholder="Enter full name"
                      required
                      className={errors.patientName ? "error" : ""}
                    />
                    {errors.patientName && <span className="error-message">{errors.patientName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Age *</label>
                    <input
                      type="number"
                      name="age"
                      value={appointmentFormData.age}
                      onChange={handleAppointmentChange}
                      placeholder="Age (1-120)"
                      required
                      min="1"
                      max="120"
                      className={errors.age ? "error" : ""}
                    />
                    {errors.age && <span className="error-message">{errors.age}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Gender *</label>
                    <select
                      name="gender"
                      value={appointmentFormData.gender}
                      onChange={handleAppointmentChange}
                      required
                      className={errors.gender ? "error" : ""}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="error-message">{errors.gender}</span>}
                  </div>
                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={appointmentFormData.phone}
                      onChange={handleAppointmentChange}
                      placeholder="10-digit (starts with 7,8,9)"
                      required
                      maxLength="10"
                      className={errors.phone ? "error" : ""}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Symptoms (Optional)</h4>
                <div className="symptoms-container">
                  <div 
                    className="symptoms-select-box"
                    onClick={() => setSymptomsDropdownOpen(!symptomsDropdownOpen)}
                  >
                    <div className="selected-symptoms-preview">
                      {appointmentFormData.symptoms.length > 0 ? (
                        <div className="selected-chips">
                          {appointmentFormData.symptoms.slice(0, 2).map((symptom) => (
                            <span key={symptom} className="symptom-chip">
                              {symptom}
                              <button 
                                type="button"
                                className="chip-remove"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAppointmentSymptomChange(symptom);
                                }}
                              >×</button>
                            </span>
                          ))}
                          {appointmentFormData.symptoms.length > 2 && (
                            <span className="more-count">
                              +{appointmentFormData.symptoms.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="placeholder">Select symptoms</span>
                      )}
                    </div>
                    <span className={`dropdown-arrow ${symptomsDropdownOpen ? 'open' : ''}`}>▼</span>
                  </div>
                  {symptomsDropdownOpen && (
                    <div className="symptoms-dropdown-menu">
                      {cardiologySymptoms.map((symptom) => (
                        <label key={symptom} className="symptom-option">
                          <input
                            type="checkbox"
                            checked={appointmentFormData.symptoms.includes(symptom)}
                            onChange={() => handleAppointmentSymptomChange(symptom)}
                          />
                          <span className="checkbox-label">{symptom}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h4>Appointment Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={appointmentFormData.date}
                      min={getMinDate()}
                      onChange={handleAppointmentChange}
                      required
                      className={errors.date ? "error" : ""}
                    />
                    {errors.date && <span className="error-message">{errors.date}</span>}
                  </div>
                  <div className="form-group">
                    <label>Time *</label>
                    <input
                      type="time"
                      name="time"
                      value={appointmentFormData.time}
                      onChange={handleAppointmentChange}
                      required
                      className={errors.time ? "error" : ""}
                    />
                    {errors.time && <span className="error-message">{errors.time}</span>}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={closePopup} className="cancel-btn">Cancel</button>
                <button type="submit" className="confirm-btn">✓ Confirm Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADD PATIENT POPUP ==================== */}
      {showPopup && popupType === "patient" && (
        <div className="booking-form-container" onClick={closePopup}>
          <div className="booking-form-card" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>➕ Register New Patient</h3>
              <button className="close-btn" onClick={closePopup}>×</button>
            </div>
            <form onSubmit={handlePatientSubmit}>
              <div className="form-section">
                <h4>Personal Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Patient Name *</label>
                    <input
                      type="text"
                      name="patientName"
                      value={patientFormData.patientName}
                      onChange={handlePatientChange}
                      placeholder="Enter full name"
                      required
                      className={errors.patientName ? "error" : ""}
                    />
                    {errors.patientName && <span className="error-message">{errors.patientName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Age *</label>
                    <input
                      type="number"
                      name="age"
                      value={patientFormData.age}
                      onChange={handlePatientChange}
                      placeholder="Age (1-120)"
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
                    <select name="gender" value={patientFormData.gender} onChange={handlePatientChange}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date of Birth *</label>
                    <input
                      type="date"
                      name="dob"
                      value={patientFormData.dob}
                      onChange={handlePatientChange}
                      max={getMinDate()}
                      required
                      className={errors.dob ? "error" : ""}
                    />
                    {errors.dob && <span className="error-message">{errors.dob}</span>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Contact Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={patientFormData.phone}
                      onChange={handlePatientChange}
                      placeholder="10-digit (starts with 7,8,9)"
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
                      value={patientFormData.alternatePhone}
                      onChange={handlePatientChange}
                      placeholder="10-digit number"
                      maxLength="10"
                      className={errors.alternatePhone ? "error" : ""}
                    />
                    {errors.alternatePhone && <span className="error-message">{errors.alternatePhone}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={patientFormData.email}
                      onChange={handlePatientChange}
                      placeholder="Enter email address"
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
                      value={patientFormData.address}
                      onChange={handlePatientChange}
                      placeholder="Enter complete address"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Medical Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Blood Group *</label>
                    <select 
                      name="bloodGroup" 
                      value={patientFormData.bloodGroup} 
                      onChange={handlePatientChange}
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
                    <label>Profession</label>
                    <input
                      type="text"
                      name="profession"
                      value={patientFormData.profession}
                      onChange={handlePatientChange}
                      placeholder="Enter profession"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Symptoms (Optional)</label>
                    <div className="symptoms-checkbox-grid">
                      {cardiologySymptoms.slice(0, 8).map((symptom) => (
                        <label key={symptom} className="symptoms-checkbox-item">
                          <input
                            type="checkbox"
                            checked={patientFormData.symptoms.includes(symptom)}
                            onChange={() => handlePatientSymptomChange(symptom)}
                          />
                          <span>{symptom}</span>
                        </label>
                      ))}
                    </div>
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
                      value={patientFormData.nameOfKin}
                      onChange={handlePatientChange}
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Number *</label>
                    <input
                      type="tel"
                      name="kinContact"
                      value={patientFormData.kinContact}
                      onChange={handlePatientChange}
                      placeholder="10-digit number"
                      maxLength="10"
                      required
                      className={errors.kinContact ? "error" : ""}
                    />
                    {errors.kinContact && <span className="error-message">{errors.kinContact}</span>}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closePopup}>Cancel</button>
                <button type="submit" className="confirm-btn">✓ Register Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADMIT PATIENT POPUP ==================== */}
      {showPopup && popupType === "admit" && (
        <div className="booking-form-container" onClick={closePopup}>
          <div className="booking-form-card" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>🏥 Admit Patient</h3>
              <button className="close-btn" onClick={closePopup}>×</button>
            </div>
            <form onSubmit={handleAdmitSubmit}>
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
                    value={admitFormData.patientName}
                    onChange={handleAdmitChange}
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
                      value={admitFormData.age}
                      onChange={handleAdmitChange}
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
                    <select name="gender" value={admitFormData.gender} onChange={handleAdmitChange}>
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
                      value={admitFormData.address}
                      onChange={handleAdmitChange}
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
                      value={admitFormData.phone}
                      onChange={handleAdmitChange}
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
                      value={admitFormData.nameOfKin}
                      onChange={handleAdmitChange}
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
                      value={admitFormData.kinContact}
                      onChange={handleAdmitChange}
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
                      value={admitFormData.bedNo}
                      onChange={handleAdmitChange}
                      placeholder="Select bed number"
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
                      value={admitFormData.fromDate}
                      onChange={handleAdmitChange}
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
                      value={admitFormData.toDate}
                      onChange={handleAdmitChange}
                      min={admitFormData.fromDate || getMinDate()}
                      className={errors.toDate ? "error" : ""}
                    />
                    {errors.toDate && <span className="error-message">{errors.toDate}</span>}
                  </div>
                  <div className="form-group">
                    <label>Admitting Doctor</label>
                    <input
                      type="text"
                      name="admittingDoctor"
                      value={admitFormData.admittingDoctor}
                      onChange={handleAdmitChange}
                      placeholder="Doctor name"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closePopup}>Cancel</button>
                <button type="submit" className="confirm-btn">✓ Admit Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ==================== EXPORT WITH PROVIDERS ====================
export default function DashboardHomeWithProviders() {
  return (
    <AppointmentsProvider>
      <PatientsProvider>
        <AdmissionsProvider>
          <DashboardHome />
        </AdmissionsProvider>
      </PatientsProvider>
    </AppointmentsProvider>
  );
}