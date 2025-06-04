import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAppointment = () => {
  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [errors, setErrors] = useState({});
  const [appointmentId, setAppointmentId] = useState("");
  const [isMedicalDropdownOpen, setIsMedicalDropdownOpen] = useState(false);
  const [isAllergyDropdownOpen, setIsAllergyDropdownOpen] = useState(false);
  const [drList, setDrList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentTimeOptions, setAppointmentTimeOptions] = useState([]);
  const [appointmentType, setAppointmentType] = useState("New");
  const [uhid, setUhid] = useState("");
  const [uhidSuggestions, setUhidSuggestions] = useState([]);
  const [showUhidSuggestions, setShowUhidSuggestions] = useState(false);
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);
  
  const selectedBranch = localStorage.getItem("selectedBranch");

  const [formData, setFormData] = useState({
    patientType: "",
    appId: "",
    patientName: "",
    gender: "Male",
    mobileNumber: "",
    age: "",
    address: "",
    medicalHistory: [],
    allergies: [],
    weight: "",
    systolic: "",
    diastolic: "",
    spo2: "",
    bloodGroup: "",
    appointmentDate: "",
    doctorName: "",
    transactionId: "",
    status: "",
    paymentMode: "Cash",
    opdAmount: "",
    branchId: selectedBranch,
    appointmentType: "New",
    uhid: "",
  });

  const medicalDropdownRef = useRef();
  const allergyDropdownRef = useRef();
  const uhidSuggestionsRef = useRef();

  const medicalHistoryOptions = [
    "Diabetes",
    "Hypertension",
    "Asthma",
    "Arthritis",
    "Liver Disease",
    "Kidney Disease",
    "Cancer",
    "HIV",
    "Depression",
    "Thyroid Disease",
    "Anxiety",
    "Cardiovascular Disease",
    "None",
  ];

  const allergyOptions = [
    "Penicillin",
    "Aspirin & NSAIDs",
    "Local Anesthesia",
    "Opioid",
    "Latex",
    "Metal",
    "Pollen & Dust",
    "None",
  ];

  useEffect(() => {
    fetchNextAppointmentId();

    // eslint-disable-next-line no-unused-vars
    const getDentistsByBranch = async (branchId) => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/user/getAllUser`
        );
        const receptionists = res.data.user.filter(
          (user) =>
            user.role === "receptionist" &&
            user.opdAmount &&
            user.branchId === localStorage.getItem("selectedBranch")
        );
        setDrList(receptionists);
      } catch (err) {
        console.error("Error fetching dentists:", err);
      }
    };
    getDentistsByBranch();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        medicalDropdownRef.current &&
        !medicalDropdownRef.current.contains(event.target)
      ) {
        setIsMedicalDropdownOpen(false);
      }
      if (
        allergyDropdownRef.current &&
        !allergyDropdownRef.current.contains(event.target)
      ) {
        setIsAllergyDropdownOpen(false);
      }
      if (
        uhidSuggestionsRef.current &&
        !uhidSuggestionsRef.current.contains(event.target)
      ) {
        setShowUhidSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 const handleAppointmentTypeChange = (e) => {
   const type = e.target.value;
   setAppointmentType(type);

   // For revisited appointments, set payment to "Free of Cost" and status to "Paid"
   if (type === "Revisited") {
     setPaymentMode("Free of Cost");
     setFormData({
       ...formData,
       appointmentType: type,
       paymentMode: "Free of Cost",
       status: "Paid",
     });
   } else {
     // For new appointments, reset to default payment options
     setPaymentMode("Cash");
     setFormData({
       ...formData,
       appointmentType: type,
       paymentMode: "Cash",
       status: "",
       uhid: "", // Explicitly clear UHID when switching to "New"
     });

     // Clear UHID field when switching to "New"
     setUhid("");
     setUhidSuggestions([]);
   }
 };

  const handleUhidChange = async (e) => {
    const value = e.target.value;
    setUhid(value);
    setFormData((prev) => ({
      ...prev,
      uhid: value,
    }));

    if (value.length > 2) {
      try {
        // Fetch patients with matching UHID
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/appointments/appointmentList`
        );

        if (response.data && response.data.appointmentList) {
          // Filter appointments by UHID that includes the input value
          const filteredUhids = response.data.appointmentList
            .filter(
              (app) =>
                app.uhid && app.uhid.toLowerCase().includes(value.toLowerCase())
            )
            .map((app) => app.uhid);

          // Remove duplicates
          const uniqueSuggestions = [...new Set(filteredUhids)];
          setUhidSuggestions(uniqueSuggestions);
          setShowUhidSuggestions(uniqueSuggestions.length > 0);
        }
      } catch (error) {
        console.error("Error fetching UHID suggestions:", error);
      }
    } else {
      setUhidSuggestions([]);
      setShowUhidSuggestions(false);
    }
  };

 const selectUhid = async (selectedUhid) => {
   setUhid(selectedUhid);
   setFormData((prev) => ({
     ...prev,
     uhid: selectedUhid,
     appointmentType: "Revisited", // Make sure appointmentType is explicitly set
   }));
   setShowUhidSuggestions(false);

   // Fetch patient data by UHID
   try {
     setIsLoadingPatient(true);
     const response = await axios.get(
       `${
         import.meta.env.VITE_APP_BASE_URL
       }/appointments/getPatientByUHID/${selectedUhid}`
     );
     console.log(response, "appointment response");
     if (response.data && response.data.patient) {
       const patient = response.data.patient;

       // For revisited patients, maintain existing UHID and set payment as "Free of Cost"
       setFormData((prev) => ({
         ...prev,
         patientType: patient.patientType || prev.patientType,
         patientName: patient.patientName || "",
         gender: patient.gender || "Male",
         mobileNumber: patient.mobileNumber || "",
         age: patient.age || "",
         address: patient.address || "",
         weight: patient.weight || "",
         spo2: patient.spo2 || "",
         bloodGroup: patient.bloodGroup || "",
         uhid: selectedUhid, // Keep the existing UHID

         // Set appointment and payment details for revisited patients
         appointmentDate: patient.appointmentDate
           ? new Date(patient.appointmentDate).toISOString().split("T")[0]
           : "",
         paymentMode: "Free of Cost", // Set payment mode to "Free of Cost"
         transactionId: "", // Clear transaction ID for revisits
         status: "Paid", // Set status to Paid automatically
         appId: patient.appId || prev.appId,
       }));

       // Handle BP separately since it might be an object
       if (patient.bp) {
         if (typeof patient.bp === "object") {
           setFormData((prev) => ({
             ...prev,
             systolic: patient.bp.systolic || "",
             diastolic: patient.bp.diastolic || "",
             bp: `${patient.bp.systolic || ""}/${patient.bp.diastolic || ""}`,
           }));
         } else {
           // If BP is a string like "120/80"
           const bpParts = String(patient.bp).split("/");
           if (bpParts.length === 2) {
             setFormData((prev) => ({
               ...prev,
               systolic: bpParts[0] || "",
               diastolic: bpParts[1] || "",
               bp: patient.bp,
             }));
           }
         }
       }

       // Handle medical history and allergies
       if (patient.medicalHistory && Array.isArray(patient.medicalHistory)) {
         setSelectedMedicalHistory(patient.medicalHistory);
         setFormData((prev) => ({
           ...prev,
           medicalHistory: patient.medicalHistory,
         }));
       }

       if (patient.allergies && Array.isArray(patient.allergies)) {
         setSelectedAllergies(patient.allergies);
         setFormData((prev) => ({
           ...prev,
           allergies: patient.allergies,
         }));
       }

       // Set payment mode for the UI state as well
       setPaymentMode("Free of Cost");

       // Fix: Handle appointment time properly - ensures we process array values correctly
       if (patient.appointmentTime) {
         const timeValue = Array.isArray(patient.appointmentTime)
           ? patient.appointmentTime[0]
           : patient.appointmentTime;

         setAppointmentTime(timeValue);
       }

       // Fix: Handle doctor name properly
       if (patient.doctorName) {
         // Extract the doctor name (handle array if needed)
         const doctorNameValue = Array.isArray(patient.doctorName)
           ? patient.doctorName[0]
           : patient.doctorName;

         // Find the doctor in the list and set it properly
         const matchedDoctor = drList.find(
           (doc) =>
             `${doc.firstName} ${doc.lastName}` === doctorNameValue ||
             doc.firstName === doctorNameValue
         );

         if (matchedDoctor) {
           console.log("Found matching doctor:", matchedDoctor);
           setSelectedDoctor(matchedDoctor);

           // Update the form data with the doctor information
           setFormData((prev) => ({
             ...prev,
             doctorName: doctorNameValue,
           }));

           // Set appointment time options based on the doctor
           if (matchedDoctor.timeSlots && matchedDoctor.timeSlots.length > 0) {
             setAppointmentTimeOptions(matchedDoctor.timeSlots);
           }

           // Make sure the opdAmount is set from the doctor if it exists
           if (
             matchedDoctor.opdAmount &&
             (!patient.opdAmount || patient.opdAmount === "")
           ) {
             setFormData((prev) => ({
               ...prev,
               opdAmount: matchedDoctor.opdAmount,
             }));
           } else if (patient.opdAmount) {
             // Use the patient's opdAmount if available
             setFormData((prev) => ({
               ...prev,
               opdAmount: patient.opdAmount,
             }));
           }
         } else {
           console.warn("Doctor not found in the list:", doctorNameValue);
           // Handle case where doctor is not in the list
           setFormData((prev) => ({
             ...prev,
             doctorName: doctorNameValue,
           }));
         }
       }

       toast.success("Patient data loaded successfully!");
     }
   } catch (error) {
     console.error("Error fetching patient data:", error);
     toast.error("Failed to load patient data");
   } finally {
     setIsLoadingPatient(false);
   }
 };

  const handleDoctorChange = (e) => {
    const selectedId = e.target.value;
    const doctor = drList.find((doc) => doc._id === selectedId);
    setSelectedDoctor(doctor);
    setFormData({
      ...formData,
      doctorName: doctor.firstName,
      opdAmount: doctor.opdAmount,
    });
    setAppointmentTimeOptions(doctor.timeSlots);
  };

  const fetchNextAppointmentId = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/appointments/appointmentList`
      );
      console.log(response, "appoitment list");
      let nextId = 1;
      if (
        response.data &&
        response.data.appointmentList &&
        response.data.appointmentList.length > 0
      ) {
        const appointments = response.data.appointmentList;
        const appIds = appointments.map((app) => parseInt(app.appId) || 0);
        nextId = Math.max(...appIds) + 1;
      }
      setAppointmentId(nextId.toString());
      setFormData((prev) => ({ ...prev, appId: nextId.toString() }));
    } catch (error) {
      console.error("Error fetching appointment ID:", error);
      setAppointmentId("1");
      setFormData((prev) => ({ ...prev, appId: "1" }));
    }
  };

  const getValidDateRange = () => {
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 3);

    return {
      min: minDate,
      max: maxDate.toISOString().split("T")[0],
    };
  };

  const dateRange = getValidDateRange();

  const toggleMedicalDropdown = () =>
    setIsMedicalDropdownOpen(!isMedicalDropdownOpen);
  const toggleAllergyDropdown = () =>
    setIsAllergyDropdownOpen(!isAllergyDropdownOpen);

  const handleMedicalHistorySelect = (condition) => {
    if (selectedMedicalHistory.includes(condition)) {
      const updatedMedicalHistory = selectedMedicalHistory.filter(
        (item) => item !== condition
      );
      setSelectedMedicalHistory(updatedMedicalHistory);
      setFormData({
        ...formData,
        medicalHistory: updatedMedicalHistory,
      });
    } else {
      const updatedMedicalHistory = [...selectedMedicalHistory, condition];
      setSelectedMedicalHistory(updatedMedicalHistory);
      setFormData({
        ...formData,
        medicalHistory: updatedMedicalHistory,
      });
    }
  };

  const handleAllergySelect = (allergy) => {
    if (selectedAllergies.includes(allergy)) {
      const updatedAllergies = selectedAllergies.filter(
        (item) => item !== allergy
      );
      setSelectedAllergies(updatedAllergies);
      setFormData({
        ...formData,
        allergies: updatedAllergies,
      });
    } else {
      const updatedAllergies = [...selectedAllergies, allergy];
      setSelectedAllergies(updatedAllergies);
      setFormData({
        ...formData,
        allergies: updatedAllergies,
      });
    }
  };

  const handlePaymentModeChange = (e) => {
    // Only allow changing payment mode for new appointments
    if (appointmentType === "New") {
      setPaymentMode(e.target.value);
      setFormData((prev) => ({
        ...prev,
        paymentMode: e.target.value,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update BP when systolic or diastolic changes
    if (name === "systolic" || name === "diastolic") {
      const bpValue =
        name === "systolic"
          ? `${value}/${formData.diastolic}`
          : `${formData.systolic}/${value}`;
      setFormData((prev) => ({
        ...prev,
        bp: bpValue,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "patientType",
      "patientName",
      "gender",
      "mobileNumber",
      "age",
      "address",
      "weight",
      "bp",
      "systolic",
      "diastolic",
      "spo2",
      "bloodGroup",
      "appointmentDate",
      "doctorName",
    ];

    // Status is required for new appointments only
    if (appointmentType === "New") {
      requiredFields.push("status");
    }

    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = "This field is required.";
    });

    if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits.";
    }

    if (formData.age && (isNaN(formData.age) || Number(formData.age) <= 0)) {
      newErrors.age = "Enter a valid age.";
    }

    if (
      formData.weight &&
      (isNaN(formData.weight) || Number(formData.weight) <= 0)
    ) {
      newErrors.weight = "Enter a valid weight.";
    }

    if (formData.systolic && isNaN(formData.systolic)) {
      newErrors.systolic = "Enter a valid number.";
    }

    if (formData.diastolic && isNaN(formData.diastolic)) {
      newErrors.diastolic = "Enter a valid number.";
    }

    if (
      formData.spo2 &&
      (isNaN(formData.spo2) || formData.spo2 < 0 || formData.spo2 > 100)
    ) {
      newErrors.spo2 = "SPO2 should be between 0 and 100.";
    }

    // Only validate transaction ID for new appointments with non-cash payment
    if (
      appointmentType === "New" &&
      paymentMode !== "Cash" &&
      paymentMode !== "Free of Cost" &&
      !formData.transactionId
    ) {
      newErrors.transactionId =
        "Transaction ID is required for non-cash payments.";
    }

    // Validate UHID is provided when appointment type is "Revisited"
    if (appointmentType === "Revisited" && !uhid) {
      newErrors.uhid = "UHID is required for revisited patients.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setSelectedMedicalHistory([]);
    setSelectedAllergies([]);
    setPaymentMode("Cash");
    setAppointmentType("New");
    setUhid("");
    setUhidSuggestions([]);

    fetchNextAppointmentId();

    setFormData({
      patientType: "",
      patientName: "",
      gender: "Male",
      mobileNumber: "",
      age: "",
      address: "",
      medicalHistory: [],
      allergies: [],
      weight: "",
      bp: "",
      systolic: "",
      diastolic: "",
      spo2: "",
      bloodGroup: "",
      appointmentDate: "",
      doctorName: "",
      transactionId: "",
      status: "",
      paymentMode: "Cash",
      opdAmount: "",
      branchId: selectedBranch,
      appointmentType: "New",
      uhid: "",
    });
  };

 const handleBookAppointment = async () => {
   if (!validateForm()) return;

   const currentTime = getCurrentTime();
   setAppointmentTime(currentTime);

   // Format BP as an object for the backend
   const { systolic, diastolic, ...restFormData } = formData;

   const finalData = {
     ...restFormData,
     appointmentTime: appointmentTime || currentTime,
     paymentMode,
     appointmentType, // Ensure appointmentType is included
     bp: {
       systolic: Number(systolic),
       diastolic: Number(diastolic),
     },
   };

   try {
     const response = await axios.post(
       `${import.meta.env.VITE_APP_BASE_URL}/appointments/addAppointment`,
       finalData
     );
     console.log("Appointment booked successfully", response.data);
     toast.success("Appointment booked successfully!");
     resetForm();
   } catch (error) {
     console.error("Error booking appointment:", error);
     toast.error("Failed to book appointment");
   }
 };

  useEffect(() => {
    if (formData.bp && typeof formData.bp === "object") {
      setFormData((prev) => ({
        ...prev,
        systolic: prev.bp.systolic,
        diastolic: prev.bp.diastolic,
      }));
    }
  }, [formData.bp]);

  return (
    <div className="mx-auto p-8 bg-gradient-to-br from-white to-teal-50 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">
        Patient Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* New fields for Appointment Type and UHID */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Appointment Type <span className="text-red-500">*</span>
          </label>
          <select
            name="appointmentType"
            value={appointmentType}
            onChange={handleAppointmentTypeChange}
            className="w-full p-3 border rounded-xl bg-white"
          >
            <option value="New">New</option>
            <option value="Revisited">Revisited</option>
          </select>
        </div>

        {appointmentType === "Revisited" && (
          <div className="relative" ref={uhidSuggestionsRef}>
            <label className="block text-sm font-medium text-gray-600">
              UHID <span className="text-red-500">*</span>
            </label>
            <input
              name="uhid"
              value={uhid}
              onChange={handleUhidChange}
              type="text"
              className="w-full p-3 border rounded-xl"
              placeholder="Enter UHID"
            />
            {errors.uhid && (
              <p className="text-red-500 text-sm mt-1">{errors.uhid}</p>
            )}
            {isLoadingPatient && (
              <div className="absolute right-3 top-9">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500"></div>
              </div>
            )}
            {showUhidSuggestions && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {uhidSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectUhid(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Patient Type <span className="text-red-500">*</span>
          </label>
          <select
            name="patientType"
            value={formData.patientType}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl bg-white"
          >
            <option value="" disabled selected hidden>
              Patient Type
            </option>
            <option value="General Patient">General Patient</option>
            <option value="Emergency Patient">Emergency Patient</option>
            <option value="Regular Patient">Regular Patient</option>
            <option value="Corporate Patient">Corporate Patient</option>
            <option value="Insurance Patient">Insurance Patient</option>
          </select>
          {errors.patientType && (
            <p className="text-red-500 text-sm mt-1">{errors.patientType}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Appointment Id<span className="text-red-500">*</span>
          </label>
          <input
            name="appId"
            value={appointmentId}
            type="text"
            required
            className="w-full p-3 border rounded-xl bg-gray-100"
            placeholder="Auto-generated ID"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Patient Name<span className="text-red-500">*</span>
          </label>
          <input
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
            type="text"
            className="w-full p-3 border rounded-xl"
            placeholder="Enter Full Name"
          />
          {errors.patientName && (
            <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Gender<span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Mobile Number<span className="text-red-500">*</span>
          </label>
          <input
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            type="number"
            placeholder="Enter Mobile Number"
            className="w-full p-3 border rounded-xl"
          />
          {errors.mobileNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Age<span className="text-red-500">*</span>
          </label>
          <input
            name="age"
            value={formData.age}
            onChange={handleChange}
            type="number"
            placeholder="Enter Age"
            className="w-full p-3 border rounded-xl"
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">{errors.age}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Address<span className="text-red-500">*</span>
          </label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            type="text"
            placeholder="Enter Address"
            className="w-full p-3 border rounded-xl"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mt-10 mb-6 border-b pb-2">
        Health Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative w-full" ref={medicalDropdownRef}>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Medical History
          </label>
          <div
            className="border rounded-xl p-3 min-h-[48px] bg-white cursor-pointer flex flex-wrap gap-2 items-center"
            onClick={toggleMedicalDropdown}
          >
            {selectedMedicalHistory.length > 0 ? (
              selectedMedicalHistory.map((condition) => (
                <span
                  key={condition}
                  className="bg-[blue-500] text-blue-700 text-sm px-2 py-1 rounded-full"
                >
                  {condition}
                </span>
              ))
            ) : (
              <span className="text-gray-400">
                Select medical conditions...
              </span>
            )}
          </div>
          {errors.medicalHistory && (
            <p className="text-red-500 text-sm mt-1">{errors.medicalHistory}</p>
          )}
          {isMedicalDropdownOpen && (
            <div className="absolute mt-2 z-10 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {medicalHistoryOptions.map((condition) => (
                <div
                  key={condition}
                  onClick={() => handleMedicalHistorySelect(condition)}
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    selectedMedicalHistory.includes(condition)
                      ? "bg-teal-50 font-semibold"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMedicalHistory.includes(condition)}
                    readOnly
                    className="mr-2"
                  />
                  {condition}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative w-full" ref={allergyDropdownRef}>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Allergies
          </label>
          <div
            className="border rounded-xl p-3 min-h-[48px] bg-white cursor-pointer flex flex-wrap gap-2 items-center"
            onClick={toggleAllergyDropdown}
          >
            {selectedAllergies.length > 0 ? (
              selectedAllergies.map((allergy) => (
                <span
                  key={allergy}
                  className="bg-red-100 text-red-700 text-sm px-2 py-1 rounded-full"
                >
                  {allergy}
                </span>
              ))
            ) : (
              <span className="text-gray-400">Select allergy types...</span>
            )}
          </div>
          {errors.allergies && (
            <p className="text-red-500 text-sm mt-1">{errors.allergies}</p>
          )}
          {isAllergyDropdownOpen && (
            <div className="absolute mt-2 z-10 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {allergyOptions.map((allergy) => (
                <div
                  key={allergy}
                  onClick={() => handleAllergySelect(allergy)}
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    selectedAllergies.includes(allergy)
                      ? "bg-red-50 font-semibold"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAllergies.includes(allergy)}
                    readOnly
                    className="mr-2"
                  />
                  {allergy}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Weight<span className="text-red-500">*</span>
          </label>
          <input
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            type="number"
            className="w-full p-3 border rounded-xl"
            placeholder="Enter weight"
          />
          {errors.weight && (
            <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Blood Pressure<span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <input
              name="systolic"
              value={formData.systolic}
              onChange={handleChange}
              type="number"
              className="w-1/2 p-3 border rounded-xl"
              placeholder="Systolic"
            />
            <input
              name="diastolic"
              value={formData.diastolic}
              onChange={handleChange}
              type="number"
              className="w-1/2 p-3 border rounded-xl"
              placeholder="Diastolic"
            />
          </div>
          {(errors.systolic || errors.diastolic) && (
            <p className="text-red-500 text-sm mt-1">
              {errors.systolic || errors.diastolic}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            SPO2<span className="text-red-500">*</span>
          </label>
          <input
            name="spo2"
            value={formData.spo2}
            type="number"
            onChange={handleChange}
            placeholder="Enter SPO2"
            className="w-full p-3 border rounded-xl"
          />
          {errors.spo2 && (
            <p className="text-red-500 text-sm mt-1">{errors.spo2}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Blood Group<span className="text-red-500">*</span>
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Select</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          {errors.bloodGroup && (
            <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mt-10 mb-6 border-b pb-2">
        Appointment Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Doctor Name<span className="text-red-500">*</span>
          </label>
          <select
            name="doctorName"
            value={selectedDoctor?._id || ""}
            onChange={handleDoctorChange}
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Select Doctor</option>
            {drList.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
               {doctor.firstName} {doctor.lastName}
              </option>
            ))}
          </select>
          {errors.doctorName && (
            <p className="text-red-500 text-sm mt-1">{errors.doctorName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Appointment Date<span className="text-red-500">*</span>
          </label>
          <input
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            type="date"
            min={dateRange.min}
            max={dateRange.max}
            className="w-full p-3 border rounded-xl"
          />
          {errors.appointmentDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.appointmentDate}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Appointment Time<span className="text-red-500">*</span>
          </label>
          <select
            name="appointmentTime"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Select Time Slot</option>
            {appointmentTimeOptions.map((timeSlot, index) => (
              <option key={index} value={timeSlot}>
                {timeSlot}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            OPD Amount
          </label>
          <input
            type="text"
            value={formData.opdAmount}
            readOnly
            className="w-full p-3 border rounded-xl bg-gray-100"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mt-10 mb-6 border-b pb-2">
        Payment Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Payment Mode
          </label>
          <select
            className="w-full p-3 border rounded-xl"
            value={paymentMode}
            name="paymentMode"
            onChange={handlePaymentModeChange}
            disabled={appointmentType === "Revisited"}
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            {appointmentType === "Revisited" && (
              <option value="Free of Cost">Free of Cost</option>
            )}
          </select>
          {errors.paymentMode && (
            <p className="text-red-500 text-sm mt-1">{errors.paymentMode}</p>
          )}
        </div>

        {paymentMode !== "Cash" &&
          paymentMode !== "Free of Cost" &&
          appointmentType === "New" && (
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Transaction ID
              </label>
              <input
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                type="text"
                placeholder="Enter TransactionId"
                className="w-full p-3 border rounded-xl"
              />
              {errors.transactionId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.transactionId}
                </p>
              )}
            </div>
          )}

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Status<span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            disabled={appointmentType === "Revisited"} // Disable for Revisited appointments
          >
            <option value="">Select Status</option>
            <option value="Paid">Paid</option>
            <option value="Due">Due</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status}</p>
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-between gap-6">
        <button
          className="bg-gray-300 px-6 py-3 rounded-xl hover:bg-gray-400 transition text-lg"
          onClick={resetForm}
        >
          Cancel
        </button>
        <button
          className="bg-[#2B7A6F] text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition text-lg"
          onClick={handleBookAppointment}
        >
          Book Appointment
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddAppointment;
