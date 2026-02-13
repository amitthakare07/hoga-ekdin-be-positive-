// import React, { useState, useEffect } from "react";
// import "./ReceptionistDashboard.css";

// // ==================== ADMIT PATIENTS PAGE ====================
// // Admitted patient management with complete validation and dynamic functionality

// function AdmitPatients() {
//   // ==================== STATE ====================
//   // Stores list of admitted patients
//   const [admittedPatients, setAdmittedPatients] = useState([]);

//   // Controls popup visibility
//   const [showBookForm, setShowBookForm] = useState(false);
//   const [showViewPopup, setShowViewPopup] = useState(false);
//   const [showEditPopup, setShowEditPopup] = useState(false);

//   // Stores selected patient for view/edit
//   const [selectedPatient, setSelectedPatient] = useState(null);

//   // Form errors state
//   const [errors, setErrors] = useState({});

//   // Symptoms dropdown state
//   const [symptomsDropdownOpen, setSymptomsDropdownOpen] = useState(false);

//   // Patient search suggestions
//   const [filteredPatients, setFilteredPatients] = useState([]);
//   const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);

//   // Search functionality
//   const [searchTerm, setSearchTerm] = useState("");

//   // Statistics state
//   const [stats, setStats] = useState({
//     total: 0,
//     male: 0,
//     female: 0,
//     newThisWeek: 0
//   });

//   // ==================== CONSTANTS ====================
//   // Available bed numbers
//   const availableBeds = [
//     "101", "102", "103", "104", "105",
//     "201", "202", "203", "204", "205",
//     "301", "302", "303", "304", "305",
//     "ICU-1", "ICU-2", "ICU-3", "ICU-4", "ICU-5",
//   ];

//   // Cardiology symptoms
//   const cardiologySymptoms = [
//     "Chest Pain", "Shortness of Breath", "Palpitations", "Dizziness",
//     "High Blood Pressure", "Fatigue", "Swelling in Legs", "Irregular Heartbeat",
//     "Nausea", "Sweating", "Pain in Arms", "Jaw Pain", "Lightheadedness",
//     "Rapid Heartbeat", "Slow Heartbeat", "Chest Discomfort", "Coughing",
//     "Ankle Swelling", "Bluish Skin", "Fainting", "Confusion",
//   ];

//   // Blood groups
//   const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

//   // ==================== INITIAL DATA ====================
//   useEffect(() => {
//     // Load initial data from localStorage or use sample data
//     const savedPatients = localStorage.getItem('admittedPatients');
//     if (savedPatients) {
//       setAdmittedPatients(JSON.parse(savedPatients));
//     } else {
//       // Sample data with proper format
//       const samplePatients = [
//         {
//           id: `ADM-${Date.now()}-1`,
//           patientName: "Aarav Patel",
//           age: 45,
//           gender: "Male",
//           address: "123 Main St, City",
//           phone: "9876543210",
//           email: "aarav@example.com",
//           bloodGroup: "A+",
//           nameOfKin: "Priya Patel",
//           kinContact: "9876543211",
//           bedNo: "101",
//           fromDate: "2024-01-15",
//           toDate: "2024-01-20",
//           symptoms: "Chest Pain, High Blood Pressure",
//           admittingDoctor: "Dr. Sharma",
//           admissionDate: "2024-01-15",
//           admissionTime: "10:30",
//           status: "Admitted"
//         },
//         {
//           id: `ADM-${Date.now()}-2`,
//           patientName: "Aanya Sharma",
//           age: 32,
//           gender: "Female",
//           address: "456 Oak Ave, Town",
//           phone: "9876543212",
//           email: "aanya@example.com",
//           bloodGroup: "B+",
//           nameOfKin: "Rahul Sharma",
//           kinContact: "9876543213",
//           bedNo: "102",
//           fromDate: "2025-01-18",
//           toDate: "2025-01-25",
//           symptoms: "Shortness of Breath, Palpitations",
//           admittingDoctor: "Dr. Gupta",
//           admissionDate: "2025-01-18",
//           admissionTime: "11:15",
//           status: "Admitted"
//         },
//         {
//           id: `ADM-${Date.now()}-3`,
//           patientName: "Arjun Singh",
//           age: 28,
//           gender: "Male",
//           address: "789 Pine Rd, Village",
//           phone: "9876543214",
//           email: "arjun@example.com",
//           bloodGroup: "O+",
//           nameOfKin: "Neha Singh",
//           kinContact: "9876543215",
//           bedNo: "ICU-1",
//           fromDate: "2025-01-19",
//           toDate: "2025-01-22",
//           symptoms: "Irregular Heartbeat, Dizziness",
//           admittingDoctor: "Dr. Verma",
//           admissionDate: "2025-01-19",
//           admissionTime: "09:45",
//           status: "Admitted"
//         },
//       ];
//       setAdmittedPatients(samplePatients);
//       localStorage.setItem('admittedPatients', JSON.stringify(samplePatients));
//     }
//   }, []);

//   // Save to localStorage whenever admittedPatients changes
//   useEffect(() => {
//     if (admittedPatients.length > 0) {
//       localStorage.setItem('admittedPatients', JSON.stringify(admittedPatients));
//     }
//     calculateStats();
//   }, [admittedPatients]);

//   // Calculate statistics
//   const calculateStats = () => {
//     const total = admittedPatients.length;
//     const male = admittedPatients.filter(p => p.gender === "Male").length;
//     const female = admittedPatients.filter(p => p.gender === "Female").length;

//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

//     const newThisWeek = admittedPatients.filter(p => {
//       const admissionDate = p.admissionDate ? new Date(p.admissionDate) : new Date(p.fromDate);
//       return admissionDate >= oneWeekAgo;
//     }).length;

//     setStats({ total, male, female, newThisWeek });
//   };

//   // Get available beds dynamically
//   const [availableBedsList, setAvailableBedsList] = useState(availableBeds);

//   useEffect(() => {
//     const occupiedBeds = admittedPatients
//       .filter(patient => patient.status !== "Discharged")
//       .map(patient => patient.bedNo);
//     setAvailableBedsList(availableBeds.filter(bed => !occupiedBeds.includes(bed)));
//   }, [admittedPatients]);

//   // ==================== FORM STATE ====================
//   const [formData, setFormData] = useState({
//     patientName: "",
//     age: "",
//     gender: "Male",
//     address: "",
//     phone: "",
//     email: "",
//     bloodGroup: "",
//     symptoms: [],
//     nameOfKin: "",
//     kinContact: "",
//     bedNo: "",
//     fromDate: "",
//     toDate: "",
//     admittingDoctor: "",
//   });

//   // ==================== HELPER FUNCTIONS ====================
//   const getMinDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   const getCurrentDateTime = () => {
//     const now = new Date();
//     return {
//       date: now.toISOString().split("T")[0],
//       time: now.toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false
//       }),
//     };
//   };

//   const formatDateForDisplay = (dateString) => {
//     if (!dateString) return "-";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   // ==================== VALIDATION FUNCTIONS ====================
//   const validateEmail = (email) => {
//     if (!email) return true; // Email is optional
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   const validatePhone = (phone) => {
//     if (!phone) return false;
//     const cleaned = phone.replace(/\D/g, '');
//     return cleaned.length === 10 && ['7', '8', '9'].includes(cleaned[0]);
//   };

//   const validateAge = (age) => {
//     if (!age) return false;
//     const ageNum = parseInt(age);
//     return !isNaN(ageNum) && ageNum > 0 && ageNum <= 120;
//   };

//   const validateName = (name) => {
//     if (!name) return false;
//     const trimmed = name.trim();
//     return trimmed.length >= 2 && trimmed.length <= 50;
//   };

//   const validateDate = (date, allowPast = false) => {
//     if (!date) return false;
//     const selectedDate = new Date(date);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return allowPast ? true : selectedDate >= today;
//   };

//   // Admit form validation
//   const validateAdmitForm = (isEdit = false) => {
//     const newErrors = {};

//     if (!validateName(formData.patientName)) {
//       newErrors.patientName = "Patient name must be between 2-50 characters";
//     }

//     if (!validateAge(formData.age)) {
//       newErrors.age = "Age must be between 1-120 years (0 not allowed)";
//     }

//     if (!validatePhone(formData.phone)) {
//       newErrors.phone = "Enter valid 10-digit number starting with 7, 8, or 9";
//     }

//     if (formData.email && !validateEmail(formData.email)) {
//       newErrors.email = "Enter valid email address";
//     }

//     if (!formData.bloodGroup) {
//       newErrors.bloodGroup = "Please select blood group";
//     }

//     if (!validatePhone(formData.kinContact)) {
//       newErrors.kinContact = "Enter valid 10-digit emergency contact number";
//     }

//     if (!formData.bedNo) {
//       newErrors.bedNo = "Please select a bed number";
//     } else if (!isEdit && !availableBedsList.includes(formData.bedNo)) {
//       newErrors.bedNo = "Selected bed is not available";
//     }

//     if (!validateDate(formData.fromDate)) {
//       newErrors.fromDate = "Admission date cannot be in the past";
//     }

//     if (formData.toDate && formData.toDate < formData.fromDate) {
//       newErrors.toDate = "Discharge date cannot be before admission date";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // ==================== HANDLER FUNCTIONS ====================
//   // Handle input changes with validation
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "phone" || name === "kinContact") {
//       const cleaned = value.replace(/\D/g, '');
//       if (cleaned.length <= 10) {
//         setFormData(prev => ({ ...prev, [name]: cleaned }));
//       }
//     } else if (name === "age") {
//       if (value === "" || /^\d+$/.test(value)) {
//         const ageNum = parseInt(value);
//         if (value === "" || (ageNum >= 0 && ageNum <= 120)) {
//           setFormData(prev => ({ ...prev, [name]: value }));
//         }
//       }
//     } else if (name === "patientName") {
//       setFormData(prev => ({ ...prev, [name]: value }));
//       // Search for existing patients when typing
//       if (value.length >= 2) {
//         const results = admittedPatients.filter(patient =>
//           patient.patientName.toLowerCase().includes(value.toLowerCase()) ||
//           patient.phone.includes(value)
//         );
//         setFilteredPatients(results);
//         setShowPatientSuggestions(results.length > 0);
//       } else {
//         setShowPatientSuggestions(false);
//       }
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }

//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }
//   };

//   // Select patient from suggestions
//   const selectPatient = (patient) => {
//     setFormData({
//       ...formData,
//       patientName: patient.patientName,
//       age: patient.age,
//       gender: patient.gender,
//       address: patient.address || "",
//       phone: patient.phone,
//       email: patient.email || "",
//       bloodGroup: patient.bloodGroup || "",
//       nameOfKin: patient.nameOfKin || "",
//       kinContact: patient.kinContact || "",
//     });
//     setShowPatientSuggestions(false);
//     setFilteredPatients([]);
//   };

//   // Handle symptom checkbox change
//   const handleSymptomChange = (symptom) => {
//     setFormData(prev => {
//       const currentSymptoms = Array.isArray(prev.symptoms) ? prev.symptoms : [];
//       return {
//         ...prev,
//         symptoms: currentSymptoms.includes(symptom)
//           ? currentSymptoms.filter(s => s !== symptom)
//           : [...currentSymptoms, symptom],
//       };
//     });
//   };

//   // Toggle symptoms dropdown
//   const toggleSymptomsDropdown = () => {
//     setSymptomsDropdownOpen(!symptomsDropdownOpen);
//   };

//   // Open admit patient form popup
//   const handleAddFormOpen = () => {
//     setFormData({
//       patientName: "",
//       age: "",
//       gender: "Male",
//       address: "",
//       phone: "",
//       email: "",
//       bloodGroup: "",
//       symptoms: [],
//       nameOfKin: "",
//       kinContact: "",
//       bedNo: "",
//       fromDate: getCurrentDateTime().date,
//       toDate: "",
//       admittingDoctor: "",
//     });
//     setErrors({});
//     setSymptomsDropdownOpen(false);
//     setShowBookForm(true);
//   };

//   // Handle form submission (Admit new patient)
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!validateAdmitForm(false)) return;

//     // Check for duplicate bed
//     const isBedOccupied = admittedPatients.some(patient =>
//       patient.bedNo === formData.bedNo && patient.status !== "Discharged"
//     );

//     if (isBedOccupied) {
//       setErrors(prev => ({ ...prev, bedNo: "This bed is already occupied" }));
//       return;
//     }

//     const newPatient = {
//       id: `ADM-${Date.now()}`,
//       ...formData,
//       symptoms: Array.isArray(formData.symptoms) ? formData.symptoms.join(", ") : "",
//       admissionDate: getCurrentDateTime().date,
//       admissionTime: getCurrentDateTime().time,
//       status: "Admitted",
//     };

//     setAdmittedPatients([...admittedPatients, newPatient]);
//     alert(`Patient ${newPatient.patientName} admitted successfully to Bed ${newPatient.bedNo}`);

//     // Reset form and close popup
//     setFormData({
//       patientName: "",
//       age: "",
//       gender: "Male",
//       address: "",
//       phone: "",
//       email: "",
//       bloodGroup: "",
//       symptoms: [],
//       nameOfKin: "",
//       kinContact: "",
//       bedNo: "",
//       fromDate: "",
//       toDate: "",
//       admittingDoctor: "",
//     });
//     setShowBookForm(false);
//   };

//   // Open view popup
//   const handleView = (patient) => {
//     setSelectedPatient(patient);
//     setShowViewPopup(true);
//   };

//   // Open edit popup
//   const handleEdit = (patient) => {
//     setSelectedPatient(patient);
//     setFormData({
//       patientName: patient.patientName || "",
//       age: patient.age || "",
//       gender: patient.gender || "Male",
//       address: patient.address || "",
//       phone: patient.phone || "",
//       email: patient.email || "",
//       bloodGroup: patient.bloodGroup || "",
//       symptoms: patient.symptoms ? patient.symptoms.split(", ") : [],
//       nameOfKin: patient.nameOfKin || "",
//       kinContact: patient.kinContact || "",
//       bedNo: patient.bedNo || "",
//       fromDate: patient.fromDate || "",
//       toDate: patient.toDate || "",
//       admittingDoctor: patient.admittingDoctor || "",
//     });
//     setErrors({});
//     setShowEditPopup(true);
//   };

//   // Handle edit submission
//   const handleEditSubmit = (e) => {
//     e.preventDefault();

//     if (!validateAdmitForm(true)) return;

//     // Check for duplicate bed (excluding current patient)
//     const isBedOccupied = admittedPatients.some(patient =>
//       patient.bedNo === formData.bedNo &&
//       patient.id !== selectedPatient.id &&
//       patient.status !== "Discharged"
//     );

//     if (isBedOccupied) {
//       setErrors(prev => ({ ...prev, bedNo: "This bed is already occupied" }));
//       return;
//     }

//     const updatedPatients = admittedPatients.map((p) =>
//       p.id === selectedPatient.id
//         ? {
//           ...p,
//           ...formData,
//           symptoms: Array.isArray(formData.symptoms) ? formData.symptoms.join(", ") : formData.symptoms,
//         }
//         : p
//     );

//     setAdmittedPatients(updatedPatients);
//     alert("Patient details updated successfully!");

//     setFormData({
//       patientName: "",
//       age: "",
//       gender: "Male",
//       address: "",
//       phone: "",
//       email: "",
//       bloodGroup: "",
//       symptoms: [],
//       nameOfKin: "",
//       kinContact: "",
//       bedNo: "",
//       fromDate: "",
//       toDate: "",
//       admittingDoctor: "",
//     });
//     setShowEditPopup(false);
//     setSelectedPatient(null);
//   };

//   // Discharge patient
//   const handleDischarge = (id) => {
//     if (window.confirm("Are you sure you want to discharge this patient?")) {
//       const updatedPatients = admittedPatients.map((p) =>
//         p.id === id
//           ? {
//             ...p,
//             status: "Discharged",
//             dischargeDate: getCurrentDateTime().date,
//             dischargeTime: getCurrentDateTime().time
//           }
//           : p
//       );
//       setAdmittedPatients(updatedPatients);
//       alert("Patient discharged successfully!");
//     }
//   };

//   // Delete patient (only for discharged patients)
//   const handleDelete = (id) => {
//     const patient = admittedPatients.find(p => p.id === id);
//     if (patient.status !== "Discharged") {
//       alert("Please discharge the patient before deleting the record!");
//       return;
//     }

//     if (window.confirm("Are you sure you want to delete this patient record?")) {
//       setAdmittedPatients(admittedPatients.filter((p) => p.id !== id));
//       alert("Patient record deleted successfully!");
//     }
//   };

//   // Filter patients based on search
//   const filteredPatientsList = admittedPatients.filter(
//     (patient) =>
//       patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (patient.phone && patient.phone.includes(searchTerm)) ||
//       (patient.bedNo && patient.bedNo.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   // ==================== ADMIT PATIENT FORM ====================
//   const AdmitPatientForm = () => (
//     <div className="booking-form-container" onClick={() => setShowBookForm(false)}>
//       <div className="booking-form-card form-with-spacing" onClick={(e) => e.stopPropagation()}>
//         <div className="form-header">
//           <h3>Admit New Patient</h3>
//           <button className="close-btn" onClick={() => setShowBookForm(false)}>×</button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="form-section">
//             <h4>Patient Information</h4>

//             {/* Patient Name with Search Suggestions */}
//             <div className="form-group patient-search-container">
//               <label>Patient Name *</label>
//               <input
//                 type="text"
//                 name="patientName"
//                 placeholder="Search or enter patient name"
//                 value={formData.patientName}
//                 onChange={handleChange}
//                 required
//                 className={errors.patientName ? "error" : ""}
//                 autoComplete="off"
//               />
//               {errors.patientName && <span className="error-message">{errors.patientName}</span>}

//               {/* Patient Suggestions Dropdown */}
//               {showPatientSuggestions && filteredPatients.length > 0 && (
//                 <div className="patient-suggestions">
//                   {filteredPatients.map(patient => (
//                     <div
//                       key={patient.id}
//                       className="patient-suggestion-item"
//                       onClick={() => selectPatient(patient)}
//                     >
//                       <strong>{patient.patientName}</strong>
//                       <span>Age: {patient.age} | Phone: {patient.phone}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Age *</label>
//                 <input
//                   type="number"
//                   name="age"
//                   placeholder="Age (1-120)"
//                   value={formData.age}
//                   onChange={handleChange}
//                   min="1"
//                   max="120"
//                   required
//                   className={errors.age ? "error" : ""}
//                 />
//                 {errors.age && <span className="error-message">{errors.age}</span>}
//               </div>

//               <div className="form-group">
//                 <label>Gender</label>
//                 <select name="gender" value={formData.gender} onChange={handleChange}>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group full-width">
//                 <label>Address</label>
//                 <input
//                   type="text"
//                   name="address"
//                   placeholder="Enter complete address"
//                   value={formData.address}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Mobile Number *</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   placeholder="10-digit (starts with 7,8,9)"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   maxLength="10"
//                   required
//                   className={errors.phone ? "error" : ""}
//                 />
//                 {errors.phone && <span className="error-message">{errors.phone}</span>}
//               </div>

//               <div className="form-group">
//                 <label>Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Enter email (optional)"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={errors.email ? "error" : ""}
//                 />
//                 {errors.email && <span className="error-message">{errors.email}</span>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Blood Group *</label>
//                 <select
//                   name="bloodGroup"
//                   value={formData.bloodGroup}
//                   onChange={handleChange}
//                   required
//                   className={errors.bloodGroup ? "error" : ""}
//                 >
//                   <option value="">Select Blood Group</option>
//                   {bloodGroups.map(group => (
//                     <option key={group} value={group}>{group}</option>
//                   ))}
//                 </select>
//                 {errors.bloodGroup && <span className="error-message">{errors.bloodGroup}</span>}
//               </div>

//               <div className="form-group">
//                 <label>Admitting Doctor</label>
//                 <input
//                   type="text"
//                   name="admittingDoctor"
//                   placeholder="Doctor name"
//                   value={formData.admittingDoctor}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Emergency Contact Name</label>
//                 <input
//                   type="text"
//                   name="nameOfKin"
//                   placeholder="Emergency contact name"
//                   value={formData.nameOfKin}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Emergency Contact Phone *</label>
//                 <input
//                   type="tel"
//                   name="kinContact"
//                   placeholder="10-digit (starts with 7,8,9)"
//                   value={formData.kinContact}
//                   onChange={handleChange}
//                   maxLength="10"
//                   required
//                   className={errors.kinContact ? "error" : ""}
//                 />
//                 {errors.kinContact && <span className="error-message">{errors.kinContact}</span>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group full-width">
//                 <label>Symptoms</label>
//                 <div className="symptoms-dropdown">
//                   <div
//                     className={`symptoms-dropdown-header ${errors.symptoms ? 'error' : ''}`}
//                     onClick={toggleSymptomsDropdown}
//                   >
//                     <span>
//                       {Array.isArray(formData.symptoms) && formData.symptoms.length > 0
//                         ? `${formData.symptoms.length} symptom(s) selected`
//                         : "Select symptoms..."}
//                     </span>
//                     <span className={`dropdown-arrow ${symptomsDropdownOpen ? 'open' : ''}`}>▼</span>
//                   </div>
//                   {symptomsDropdownOpen && (
//                     <div className="symptoms-dropdown-menu">
//                       <div className="symptoms-checkbox-grid">
//                         {cardiologySymptoms.map((symptom) => (
//                           <label key={symptom} className="symptoms-checkbox-item">
//                             <input
//                               type="checkbox"
//                               checked={Array.isArray(formData.symptoms) && formData.symptoms.includes(symptom)}
//                               onChange={() => handleSymptomChange(symptom)}
//                             />
//                             <span>{symptom}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="form-section">
//             <h4>Admission Details</h4>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Bed Number *</label>
//                 <input
//                   type="text"
//                   name="bedNo"
//                   placeholder="Select bed number"
//                   value={formData.bedNo}
//                   onChange={handleChange}
//                   list="bed-numbers-add"
//                   required
//                   className={errors.bedNo ? "error" : ""}
//                 />
//                 <datalist id="bed-numbers-add">
//                   {availableBedsList.map((bed, index) => (
//                     <option key={index} value={bed} />
//                   ))}
//                 </datalist>
//                 {errors.bedNo && <span className="error-message">{errors.bedNo}</span>}
//                 <small className="field-hint">
//                   Available beds: {availableBedsList.length}
//                 </small>
//               </div>

//               <div className="form-group">
//                 <label>Admission Date *</label>
//                 <input
//                   type="date"
//                   name="fromDate"
//                   value={formData.fromDate}
//                   onChange={handleChange}
//                   min={getMinDate()}
//                   required
//                   className={errors.fromDate ? "error" : ""}
//                 />
//                 {errors.fromDate && <span className="error-message">{errors.fromDate}</span>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Expected Discharge Date</label>
//                 <input
//                   type="date"
//                   name="toDate"
//                   value={formData.toDate}
//                   onChange={handleChange}
//                   min={formData.fromDate || getMinDate()}
//                   className={errors.toDate ? "error" : ""}
//                 />
//                 {errors.toDate && <span className="error-message">{errors.toDate}</span>}
//               </div>
//             </div>
//           </div>

//           <div className="form-actions">
//             <button type="button" className="cancel-btn" onClick={() => setShowBookForm(false)}>
//               Cancel
//             </button>
//             <button type="submit" className="confirm-btn">
//               Admit Patient
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

//   // ==================== PATIENT LIST VIEW ====================
//   const PatientListView = () => (
//     <div className="patient-list-page">
//       {/* ==================== PAGE HEADER ==================== */}
//       <div className="page-header">
//         <div>
//           <h1>Admitted Patients</h1>
//           <p className="page-subtitle">Manage patient admissions and discharges</p>
//         </div>
//         <button className="add-btn" onClick={handleAddFormOpen}>
//           + Admit New Patient
//         </button>
//       </div>

//       {/* ==================== SUMMARY STATISTICS ==================== */}
//       <div className="summary-stats">
//         <div className="summary-card">
//           <div className="summary-icon">🛏️</div>
//           <div className="summary-info">
//             <h4>Total Admitted</h4>
//             <p>{stats.total}</p>
//           </div>
//         </div>
//         <div className="summary-card">
//           <div className="summary-icon">👨</div>
//           <div className="summary-info">
//             <h4>Male</h4>
//             <p>{stats.male}</p>
//           </div>
//         </div>
//         <div className="summary-card">
//           <div className="summary-icon">👩</div>
//           <div className="summary-info">
//             <h4>Female</h4>
//             <p>{stats.female}</p>
//           </div>
//         </div>
//         <div className="summary-card">
//           <div className="summary-icon">📅</div>
//           <div className="summary-info">
//             <h4>New This Week</h4>
//             <p>{stats.newThisWeek}</p>
//           </div>
//         </div>
//       </div>

//       {/* ==================== SEARCH AND FILTER ==================== */}
//       <div className="search-container">
//         <div className="search-wrapper">
//           <span className="search-icon">🔍</span>
//           <input
//             type="text"
//             placeholder="Search by patient name, mobile number, or bed number..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//           {searchTerm && (
//             <button className="clear-search" onClick={() => setSearchTerm("")}>
//               ×
//             </button>
//           )}
//         </div>
//         <div className="filter-badge">
//           {filteredPatientsList.length} patient(s) found
//         </div>
//       </div>

//       {/* ==================== ADMITTED PATIENTS TABLE ==================== */}
//       <div className="table-container">
//         <table className="data-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Patient Name</th>
//               <th>Age/Gender</th>
//               <th>Contact</th>
//               <th>Bed No</th>
//               <th>Admission Date</th>
//               <th>Doctor</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredPatientsList.length > 0 ? (
//               filteredPatientsList.map((patient) => (
//                 <tr key={patient.id} className={patient.status === "Discharged" ? "discharged-row" : ""}>
//                   <td>#{patient.id.split('-')[1]}</td>
//                   <td>
//                     <div className="patient-name-cell">
//                       <strong>{patient.patientName}</strong>
//                       {patient.bloodGroup && (
//                         <span className="blood-group-badge">{patient.bloodGroup}</span>
//                       )}
//                     </div>
//                   </td>
//                   <td>{patient.age}y / {patient.gender}</td>
//                   <td>
//                     <div className="contact-info">
//                       <div>{patient.phone}</div>
//                       {patient.nameOfKin && (
//                         <small>Kin: {patient.nameOfKin}</small>
//                       )}
//                     </div>
//                   </td>
//                   <td>
//                     <span className="bed-badge">{patient.bedNo}</span>
//                   </td>
//                   <td>
//                     <div>{formatDateForDisplay(patient.fromDate)}</div>
//                     {patient.toDate && (
//                       <small>to {formatDateForDisplay(patient.toDate)}</small>
//                     )}
//                   </td>
//                   <td>{patient.admittingDoctor || "-"}</td>
//                   <td>
//                     <span className={`status-badge ${patient.status?.toLowerCase() || 'admitted'}`}>
//                       {patient.status || 'Admitted'}
//                     </span>
//                   </td>
//                   <td>
//                     <div className="action-buttons">
//                       <button className="view-btn" onClick={() => handleView(patient)} title="View">
//                         👁️
//                       </button>
//                       <button className="edit-btn" onClick={() => handleEdit(patient)} title="Edit">
//                         ✏️
//                       </button>
//                       {patient.status !== "Discharged" ? (
//                         <button className="discharge-btn" onClick={() => handleDischarge(patient.id)} title="Discharge">
//                           🏠
//                         </button>
//                       ) : (
//                         <button className="delete-btn" onClick={() => handleDelete(patient.id)} title="Delete">
//                           🗑️
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="9" className="no-data">
//                   <div className="no-data-message">
//                     <span className="no-data-icon">🏥</span>
//                     <p>No admitted patients found</p>
//                     <button className="add-btn-small" onClick={handleAddFormOpen}>
//                       Admit a Patient
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//   // ==================== VIEW POPUP ====================
//   const ViewPopup = () => (
//     <div className="popup-overlay" onClick={() => setShowViewPopup(false)}>
//       <div className="popup-card view-popup" onClick={(e) => e.stopPropagation()}>
//         <div className="popup-header">
//           <h2>Patient Details</h2>
//           <button className="close-btn" onClick={() => setShowViewPopup(false)}>×</button>
//         </div>

//         <div className="popup-content">
//           <div className="detail-section">
//             <h4>Personal Information</h4>
//             <div className="detail-grid">
//               <div className="detail-row">
//                 <span className="detail-label">Patient Name:</span>
//                 <span className="detail-value">{selectedPatient.patientName}</span>
//               </div>
//               <div className="detail-row">
//                 <span className="detail-label">Age/Gender:</span>
//                 <span className="detail-value">{selectedPatient.age} years / {selectedPatient.gender}</span>
//               </div>
//               <div className="detail-row">
//                 <span className="detail-label">Blood Group:</span>
//                 <span className="detail-value">{selectedPatient.bloodGroup || "-"}</span>
//               </div>
//               <div className="detail-row">
//                 <span className="detail-label">Address:</span>
//                 <span className="detail-value">{selectedPatient.address || "-"}</span>
//               </div>
//               <div className="detail-row">
//                 <span className="detail-label">Mobile Number:</span>
//                 <span className="detail-value">{selectedPatient.phone}</span>
//               </div>
//               <div className="detail-row">
//                 <span className="detail-label">Email:</span>
//                 <span className="detail-value">{selectedPatient.email || "-"}</span>
//               </div>
//             </div>
//           </div>

//           <div className="detail-section">
//             <h4>Emergency Contact</h4>
//             <div className="detail-grid">
//               <div className="detail-row">
//                 <span className="detail-label">Contact Name:</span>
//                 <span className="detail-value">{selectedPatient.nameOfKin || "-"}</span>
//               </div>
//               <div className="detail-row">
//                 <span className="detail-label">Contact Phone:</span>
//                 <span className="detail-value">{selectedPatient.kinContact || "-"}</span>
//               </div>
//             </div>
//           </div>

//           <div className="detail-section">
//             <h4>Admission Details</h4>
//             <div className="detail-grid">
//               <div className="detail-row">
//                 <span className="detail-label">Bed Number:</span>
//                 <span className="detail-value bed-number">{selectedPatient.bedNo}</span>
//               </div>
//               <div className="detail-row">
//                 <span className="detail-label">Admission Date:</span>
//                 <span className="detail-value">{formatDateForDisplay(selectedPatient.fromDate)}</span>
//               </div>
//               <div className="detail-row">
//                 <span className="detail-label">Admission Time:</span>
//                 <span className="detail-value">{selectedPatient.admissionTime || "10:30"}</span>
//               </div>
//               <div className="detail-row">
//                 <span className="detail-label">Discharge Date:</span>
//                 <span className="detail-value">{selectedPatient.toDate ? formatDateForDisplay(selectedPatient.toDate) : "-"}</span>
//               </div>
//               <div className="detail-row">
//                 <span className="detail-label">Admitting Doctor:</span>
//                 <span className="detail-value">{selectedPatient.admittingDoctor || "-"}</span>
//               </div>
//               <div className="detail-row">
//                 <span className="detail-label">Status:</span>
//                 <span className={`status-badge ${selectedPatient.status?.toLowerCase() || 'admitted'}`}>
//                   {selectedPatient.status || 'Admitted'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="detail-section">
//             <h4>Symptoms</h4>
//             <div className="symptoms-list">
//               {selectedPatient.symptoms ? (
//                 selectedPatient.symptoms.split(", ").map((symptom, index) => (
//                   <span key={index} className="symptom-tag">{symptom}</span>
//                 ))
//               ) : (
//                 <span className="detail-value">No symptoms recorded</span>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="popup-actions">
//           {selectedPatient.status !== "Discharged" && (
//             <button
//               className="discharge-btn"
//               onClick={() => {
//                 setShowViewPopup(false);
//                 handleDischarge(selectedPatient.id);
//               }}
//             >
//               Discharge Patient
//             </button>
//           )}
//           <button
//             className="edit-btn"
//             onClick={() => {
//               setShowViewPopup(false);
//               handleEdit(selectedPatient);
//             }}
//           >
//             Edit Details
//           </button>
//           <button className="cancel-btn" onClick={() => setShowViewPopup(false)}>
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // ==================== EDIT POPUP ====================
//   const EditPopup = () => (
//     <div className="popup-overlay" onClick={() => setShowEditPopup(false)}>
//       <div className="popup-card wide-popup" onClick={(e) => e.stopPropagation()}>
//         <div className="popup-header">
//           <h2>Edit Patient Details</h2>
//           <button className="close-btn" onClick={() => setShowEditPopup(false)}>×</button>
//         </div>

//         <form onSubmit={handleEditSubmit}>
//           <div className="form-section">
//             <h4>Patient Information</h4>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Patient Name *</label>
//                 <input
//                   type="text"
//                   name="patientName"
//                   placeholder="Enter full name"
//                   value={formData.patientName}
//                   onChange={handleChange}
//                   required
//                   className={errors.patientName ? "error" : ""}
//                 />
//                 {errors.patientName && <span className="error-message">{errors.patientName}</span>}
//               </div>

//               <div className="form-group">
//                 <label>Age *</label>
//                 <input
//                   type="number"
//                   name="age"
//                   placeholder="Age (1-120)"
//                   value={formData.age}
//                   onChange={handleChange}
//                   min="1"
//                   max="120"
//                   required
//                   className={errors.age ? "error" : ""}
//                 />
//                 {errors.age && <span className="error-message">{errors.age}</span>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Gender</label>
//                 <select name="gender" value={formData.gender} onChange={handleChange}>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label>Blood Group *</label>
//                 <select
//                   name="bloodGroup"
//                   value={formData.bloodGroup}
//                   onChange={handleChange}
//                   required
//                   className={errors.bloodGroup ? "error" : ""}
//                 >
//                   <option value="">Select Blood Group</option>
//                   {bloodGroups.map(group => (
//                     <option key={group} value={group}>{group}</option>
//                   ))}
//                 </select>
//                 {errors.bloodGroup && <span className="error-message">{errors.bloodGroup}</span>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group full-width">
//                 <label>Address</label>
//                 <input
//                   type="text"
//                   name="address"
//                   placeholder="Enter complete address"
//                   value={formData.address}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Mobile Number *</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   placeholder="10-digit (starts with 7,8,9)"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   maxLength="10"
//                   required
//                   className={errors.phone ? "error" : ""}
//                 />
//                 {errors.phone && <span className="error-message">{errors.phone}</span>}
//               </div>

//               <div className="form-group">
//                 <label>Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Enter email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={errors.email ? "error" : ""}
//                 />
//                 {errors.email && <span className="error-message">{errors.email}</span>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Emergency Contact Name</label>
//                 <input
//                   type="text"
//                   name="nameOfKin"
//                   placeholder="Emergency contact name"
//                   value={formData.nameOfKin}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Emergency Contact Phone *</label>
//                 <input
//                   type="tel"
//                   name="kinContact"
//                   placeholder="10-digit (starts with 7,8,9)"
//                   value={formData.kinContact}
//                   onChange={handleChange}
//                   maxLength="10"
//                   required
//                   className={errors.kinContact ? "error" : ""}
//                 />
//                 {errors.kinContact && <span className="error-message">{errors.kinContact}</span>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group full-width">
//                 <label>Symptoms</label>
//                 <div className="symptoms-dropdown">
//                   <div
//                     className="symptoms-dropdown-header"
//                     onClick={toggleSymptomsDropdown}
//                   >
//                     <span>
//                       {Array.isArray(formData.symptoms) && formData.symptoms.length > 0
//                         ? `${formData.symptoms.length} symptom(s) selected`
//                         : "Select symptoms..."}
//                     </span>
//                     <span className={`dropdown-arrow ${symptomsDropdownOpen ? 'open' : ''}`}>▼</span>
//                   </div>
//                   {symptomsDropdownOpen && (
//                     <div className="symptoms-dropdown-menu">
//                       <div className="symptoms-checkbox-grid">
//                         {cardiologySymptoms.map((symptom) => (
//                           <label key={symptom} className="symptoms-checkbox-item">
//                             <input
//                               type="checkbox"
//                               checked={Array.isArray(formData.symptoms) && formData.symptoms.includes(symptom)}
//                               onChange={() => handleSymptomChange(symptom)}
//                             />
//                             <span>{symptom}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="form-section">
//             <h4>Admission Details</h4>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Bed Number *</label>
//                 <input
//                   type="text"
//                   name="bedNo"
//                   placeholder="Select bed number"
//                   value={formData.bedNo}
//                   onChange={handleChange}
//                   list="bed-numbers-edit"
//                   required
//                   className={errors.bedNo ? "error" : ""}
//                 />
//                 <datalist id="bed-numbers-edit">
//                   {availableBedsList.map((bed, index) => (
//                     <option key={index} value={bed} />
//                   ))}
//                 </datalist>
//                 {errors.bedNo && <span className="error-message">{errors.bedNo}</span>}
//               </div>

//               <div className="form-group">
//                 <label>Admission Date *</label>
//                 <input
//                   type="date"
//                   name="fromDate"
//                   value={formData.fromDate}
//                   onChange={handleChange}
//                   required
//                   className={errors.fromDate ? "error" : ""}
//                 />
//                 {errors.fromDate && <span className="error-message">{errors.fromDate}</span>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Expected Discharge Date</label>
//                 <input
//                   type="date"
//                   name="toDate"
//                   value={formData.toDate}
//                   onChange={handleChange}
//                   min={formData.fromDate}
//                   className={errors.toDate ? "error" : ""}
//                 />
//                 {errors.toDate && <span className="error-message">{errors.toDate}</span>}
//               </div>

//               <div className="form-group">
//                 <label>Admitting Doctor</label>
//                 <input
//                   type="text"
//                   name="admittingDoctor"
//                   placeholder="Doctor name"
//                   value={formData.admittingDoctor}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="popup-actions">
//             <button type="button" className="cancel-btn" onClick={() => setShowEditPopup(false)}>
//               Cancel
//             </button>
//             <button type="submit" className="confirm-btn">
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

//   return (
//     <div className="admit-patients-page">
//       <PatientListView />

//       {/* ==================== ADMIT PATIENT POPUP ==================== */}
//       {showBookForm && <AdmitPatientForm />}

//       {/* ==================== VIEW POPUP ==================== */}
//       {showViewPopup && selectedPatient && <ViewPopup />}

//       {/* ==================== EDIT POPUP ==================== */}
//       {showEditPopup && selectedPatient && <EditPopup />}
//     </div>
//   );
// }

// export default AdmitPatients;

import React, { useState } from "react";
import "./PatientRegistrationForm.css";

function PatientRegistrationForm({ onClose, addPatient, patients }) {
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
    kinContact: ""
  });
  
  const [errors, setErrors] = useState({});

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const cardiologySymptoms = [
    "Chest Pain", "Shortness of Breath", "Palpitations", 
    "High Blood Pressure", "Dizziness", "Fatigue", 
    "Swelling in Legs", "Irregular Heartbeat",
    "Nausea", "Sweating", "Pain in Arms", "Jaw Pain",
    "Lightheadedness", "Rapid Heartbeat", "Slow Heartbeat",
    "Chest Discomfort", "Coughing", "Ankle Swelling",
    "Bluish Skin", "Fainting", "Confusion"
  ];

  const getMinDate = () => new Date().toISOString().split('T')[0];
  
  const calculateAgeFromDOB = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age.toString();
  };

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!validateName(formData.patientName)) 
      newErrors.patientName = "Patient name must be between 2-50 characters";
    if (!validateAge(formData.age)) 
      newErrors.age = "Age must be between 1-120 years";
    if (!formData.dob) 
      newErrors.dob = "Date of birth is required";
    else {
      const age = parseInt(formData.age);
      const calculatedAge = parseInt(calculateAgeFromDOB(formData.dob));
      if (age !== calculatedAge) newErrors.dob = "Age doesn't match date of birth";
    }
    if (!validatePhone(formData.phone)) 
      newErrors.phone = "Enter valid 10-digit number starting with 7,8,9";
    if (formData.alternatePhone && !validatePhone(formData.alternatePhone))
      newErrors.alternatePhone = "Enter valid 10-digit number starting with 7,8,9";
    if (!validateEmail(formData.email)) 
      newErrors.email = "Enter valid email address";
    if (!formData.bloodGroup) 
      newErrors.bloodGroup = "Please select blood group";
    if (formData.kinContact && !validatePhone(formData.kinContact)) 
      newErrors.kinContact = "Enter valid 10-digit emergency contact number";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "dob") {
      const age = calculateAgeFromDOB(value);
      setFormData(prev => ({ ...prev, dob: value, age: age }));
    } else if (name === "age") {
      if (value === "" || /^\d+$/.test(value)) {
        const ageNum = parseInt(value);
        if (value === "" || (ageNum >= 0 && ageNum <= 120))
          setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (["phone", "alternatePhone", "kinContact"].includes(name)) {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 10) setFormData(prev => ({ ...prev, [name]: cleaned }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const isDuplicate = patients?.some(p => 
      p.phone === formData.phone || p.email === formData.email
    );
    
    if (isDuplicate) {
      alert("❌ Patient with this phone or email already exists!");
      return;
    }
    
    addPatient(formData);
    alert(`✅ Patient ${formData.patientName} registered successfully!`);
    onClose();
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-container patient-form" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h3>➕ Register New Patient</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h4>Personal Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name *</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
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
                <label>Date of Birth </label>
                <input

                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
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
                  value={formData.phone}
                  onChange={handleChange}
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
                style={{marginTop:"38px"}}
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleChange}
                  placeholder="Alternate Number"
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
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Medical Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label style={{paddingBottom:"7px"}}>Blood Group </label>
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
                <label style={{display:"block",paddingTop:"3px"}}>Profession </label>
                <input
                  style={{paddingtop:"13px",paddingBottom:"10px"}}
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
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

          <div className="form-section">
            <h4>Emergency Contact</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Person Name</label>
                <input
                  type="text"
                  name="nameOfKin"
                  value={formData.nameOfKin}
                  onChange={handleChange}
                  placeholder="Emergency contact name"
                />
              </div>
              <div className="form-group">
              
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

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="confirm-btn">Register Patient</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientRegistrationForm;