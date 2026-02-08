# TODO: Add All Fields to Register New Patient

## Task Overview
Add comprehensive fields to the patient registration form in `src/Webpages/Patients.js` to create a complete hospital management system.

## Fields to Add

### Personal Details (New)
- [ ] Marital Status (Single/Married/Divorced/Widowed)
- [ ] Nationality (Indian/Other)
- [ ] Religion (Hindu/Muslim/Christian/Sikh/Other)

### Contact Details (New)
- [ ] Emergency Contact Name
- [ ] Emergency Contact Phone
- [ ] City
- [ ] State
- [ ] Postal Code

### Identification (New)
- [ ] Aadhar Card Number
- [ ] PAN Number

### Medical Information (New)
- [ ] Weight (kg)
- [ ] Height (cm)
- [ ] Blood Pressure (mmHg)
- [ ] Pulse Rate (bpm)
- [ ] Any Allergies

### Insurance & Administrative (New)
- [ ] Insurance Provider
- [ ] Policy Number
- [ ] Ward Type (General/Private/ICU)
- [ ] Assigned Doctor
- [ ] Payment Mode (Cash/Card/Insurance/UPI)
- [ ] Reference By

## Implementation Steps

### Step 1: Update State Management
- [ ] Add new fields to formData state
- [ ] Add new fields to sample patient data
- [ ] Add new fields to resetForm function

### Step 2: Update Add Patient Form
- [ ] Add new input fields with proper labels
- [ ] Add appropriate input types (text, number, select)
- [ ] Add validation attributes (required, pattern, etc.)
- [ ] Add datalists for autocomplete where applicable

### Step 3: Update Edit Form
- [ ] Add new fields to edit popup
- [ ] Ensure pre-population of existing patient data

### Step 4: Update View Popup
- [ ] Add new fields to view patient details
- [ ] Display all information in a clean format

### Step 5: Update Table Display
- [ ] Add new columns for important fields
- [ ] Ensure proper data display

### Step 6: Update Search Functionality
- [ ] Add new fields to search filter

## Files to Modify
- `src/Webpages/Patients.js` - Main file containing all patient management functionality

## Notes
- All new fields should have proper placeholder text
- Required fields should be marked appropriately
- Dropdown options should be comprehensive
- Phone numbers should have proper validation
- Date fields should have proper formatting
- The form should remain responsive and user-friendly

