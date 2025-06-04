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

  const [isMedicalDropdownOpen, setIsMedicalDropdownOpen] = useState(false);
  const [isAllergyDropdownOpen, setIsAllergyDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientType: "",
    appId: "",
    patientName: "",
    gender: "",
    mobileNumber: "",
    age: "",
    address: "",
    weight: "",
    systolic: "",
    diastolic: "",
    spo2: "",
    bloodGroup: "",
    appointmentDate: "",
    doctorName: "",
    transactionId: "",
    status: "",
  });

  const medicalDropdownRef = useRef();
  const allergyDropdownRef = useRef();

  const medicalHistoryOptions = [
    "Diabetes", "Hypertension", "Asthma", "Arthritis",
    "Liver Disease", "Kidney Disease", "Cancer", "HIV",
    "Depression", "Thyroid Disease", "Anxiety", "Cardiovascular Disease", "None"
  ];

  const allergyOptions = [
    "Penicillin", "Aspirin & NSAIDs", "Local Anesthesia", "Opioid",
    "Latex", "Metal", "Pollen & Dust", "None"
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (medicalDropdownRef.current && !medicalDropdownRef.current.contains(event.target)) {
        setIsMedicalDropdownOpen(false);
      }
      if (allergyDropdownRef.current && !allergyDropdownRef.current.contains(event.target)) {
        setIsAllergyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMedicalDropdown = () => setIsMedicalDropdownOpen(!isMedicalDropdownOpen);
  const toggleAllergyDropdown = () => setIsAllergyDropdownOpen(!isAllergyDropdownOpen);

  const handleMedicalHistorySelect = (condition) => {
    setSelectedMedicalHistory((prev) =>
      prev.includes(condition) ? prev.filter((item) => item !== condition) : [...prev, condition]
    );
  };

  const handleAllergySelect = (allergy) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((item) => item !== allergy) : [...prev, allergy]
    );
  };

  const handlePaymentModeChange = (e) => {
    setPaymentMode(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      "patientType", "appId", "patientName", "gender", "mobileNumber",
      "age", "address", "weight", "systolic", "diastolic", "spo2",
      "bloodGroup", "appointmentDate", "doctorName", "status"
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) newErrors[field] = "This field is required.";
    });

    if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits.";
    }

    if (formData.age && (isNaN(formData.age) || Number(formData.age) <= 0)) {
      newErrors.age = "Enter a valid age.";
    }

    if (formData.weight && (isNaN(formData.weight) || Number(formData.weight) <= 0)) {
      newErrors.weight = "Enter a valid weight.";
    }

    if (formData.systolic && isNaN(formData.systolic)) {
      newErrors.systolic = "Enter a valid number.";
    }

    if (formData.diastolic && isNaN(formData.diastolic)) {
      newErrors.diastolic = "Enter a valid number.";
    }

    if (formData.spo2 && (isNaN(formData.spo2) || formData.spo2 < 0 || formData.spo2 > 100)) {
      newErrors.spo2 = "SPO2 should be between 0 and 100.";
    }

    if (paymentMode !== "Cash" && !formData.transactionId) {
      newErrors.transactionId = "Transaction ID is required for non-cash payments.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookAppointment = async () => {
    if (!validateForm()) return;

    const currentTime = getCurrentTime();
    setAppointmentTime(currentTime);

    const finalData = {
      ...formData,
      appointmentTime: currentTime,
      selectedMedicalHistory,
      selectedAllergies,
      paymentMode,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/addAppointment`, finalData);
      console.log("Appointment booked successfully", response.data);
      toast.success("Appointment booked successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-white to-teal-50 shadow-xl rounded-2xl">

      <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">Patient Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">Patient Type</label>
          <select
            name="patientType"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl bg-white"
          >
            <option value="" disabled selected hidden>Patient Type</option>
            <option value="general">General Patient</option>
            <option value="emergency">Emergency Patient</option>
            <option value="regular">Regular Patient</option>
            <option value="corporate">Corporate Patient</option>
            <option value="insurance">Insurance Patient</option>
          </select>
          {errors.patientType && (
            <p className="text-red-500 text-sm mt-1">{errors.patientType}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Appointment Id</label>
          <input
            name="appId"
            onChange={handleChange}
            type="text"
            required
            className="w-full p-3 border rounded-xl"
            placeholder="Enter app Id"
          />
          {errors.appId && (
            <p className="text-red-500 text-sm mt-1">{errors.appId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Patient Name</label>
          <input
            name="patientName"
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
          <label className="block text-sm font-medium text-gray-600">Gender</label>
          <select
            name="gender"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Mobile Number</label>
          <input
            name="mobileNumber"
            onChange={handleChange}
            type="number"
            className="w-full p-3 border rounded-xl"
          />
          {errors.mobileNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Age</label>
          <input
            name="age"
            onChange={handleChange}
            type="number"
            className="w-full p-3 border rounded-xl"
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">{errors.age}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Address</label>
          <input
            name="address"
            onChange={handleChange}
            type="text"
            className="w-full p-3 border rounded-xl"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
      </div>


      <h2 className="text-2xl font-bold text-gray-700 mt-10 mb-6 border-b pb-2">Health Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative w-full max-w-md" ref={medicalDropdownRef}>
          <label className="block mb-1 text-sm font-medium text-gray-700">Medical History</label>
          <div
            className="border rounded-xl p-3 min-h-[48px] bg-white cursor-pointer flex flex-wrap gap-2 items-center"
            onClick={toggleMedicalDropdown}
          >
            {selectedMedicalHistory.length > 0 ? (
              selectedMedicalHistory.map((condition) => (
                <span key={condition} className="bg-teal-100 text-teal-700 text-sm px-2 py-1 rounded-full">
                  {condition}
                </span>
              ))
            ) : (
              <span className="text-gray-400">Select medical conditions...</span>
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
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedMedicalHistory.includes(condition) ? "bg-teal-50 font-semibold" : ""}`}
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

        <div className="relative w-full max-w-md" ref={allergyDropdownRef}>
          <label className="block mb-1 text-sm font-medium text-gray-700">Allergies</label>
          <div
            className="border rounded-xl p-3 min-h-[48px] bg-white cursor-pointer flex flex-wrap gap-2 items-center"
            onClick={toggleAllergyDropdown}
          >
            {selectedAllergies.length > 0 ? (
              selectedAllergies.map((allergy) => (
                <span key={allergy} className="bg-red-100 text-red-700 text-sm px-2 py-1 rounded-full">
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
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedAllergies.includes(allergy) ? "bg-red-50 font-semibold" : ""}`}
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
          <label className="block text-sm font-medium text-gray-600">Weight</label>
          <input name="weight" onChange={handleChange} type="number" className="w-full p-3 border rounded-xl" />
          {errors.weight && (
            <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Blood Pressure</label>
          <div className="flex gap-3">
            <input name="systolic" onChange={handleChange} type="number" className="w-1/2 p-3 border rounded-xl" placeholder="Systolic" />
            <input name="diastolic" onChange={handleChange} type="number" className="w-1/2 p-3 border rounded-xl" placeholder="Diastolic" />
          </div>
          {(errors.systolic || errors.diastolic) && (
            <p className="text-red-500 text-sm mt-1">
              {errors.systolic || errors.diastolic}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">SPO2</label>
          <input
            name="spo2"
            type="number"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />
          {errors.spo2 && (
            <p className="text-red-500 text-sm mt-1">{errors.spo2}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Blood Group</label>
          <select name="bloodGroup" onChange={handleChange} className="w-full p-3 border rounded-xl">
            <option value="">Select</option>
            <option>A+</option>
            <option>B+</option>
            <option>O+</option>
            <option>AB+</option>
          </select>
          {errors.bloodGroup && (
            <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mt-10 mb-6 border-b pb-2">Appointment Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">Appointment Date</label>
          <input
            name="appointmentDate"
            onChange={handleChange}
            type="date"
            className="w-full p-3 border rounded-xl"
          />
          {errors.appointmentDate && (
            <p className="text-red-500 text-sm mt-1">{errors.appointmentDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Appointment Time</label>
          <input
            type="time"
            className="w-full p-3 border rounded-xl"
            value={appointmentTime}
            readOnly
          />
          {/* You can add an error display here too if needed:
    {errors.appointmentTime && (
      <p className="text-red-500 text-sm mt-1">{errors.appointmentTime}</p>
    )} 
    */}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Doctor Name</label>
          <input
            name="doctorName"
            onChange={handleChange}
            type="text"
            className="w-full p-3 border rounded-xl"
          />
          {errors.doctorName && (
            <p className="text-red-500 text-sm mt-1">{errors.doctorName}</p>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mt-10 mb-6 border-b pb-2">Payment Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">OPD Amount</label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl bg-gray-100"
            placeholder="Auto fetch"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Payment Mode</label>
          <select
            className="w-full p-3 border rounded-xl"
            value={paymentMode}
            onChange={handlePaymentModeChange}
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
          </select>
          {errors.paymentMode && (
            <p className="text-red-500 text-sm mt-1">{errors.paymentMode}</p>
          )}
        </div>

        {paymentMode !== "Cash" && (
          <div>
            <label className="block text-sm font-medium text-gray-600">Transaction ID</label>
            <input
              name="transactionId"
              onChange={handleChange}
              type="text"
              className="w-full p-3 border rounded-xl"
            />
            {errors.transactionId && (
              <p className="text-red-500 text-sm mt-1">{errors.transactionId}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-600">Status</label>
          <select
            name="status"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Status</option>
            <option>Paid</option>
            <option>Due</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status}</p>
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-6">
        <button
          className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition text-lg"
          onClick={handleBookAppointment}
        >
          Book Appointment
        </button>
        <button className="bg-gray-300 px-6 py-3 rounded-xl hover:bg-gray-400 transition text-lg">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddAppointment;
