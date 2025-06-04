/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditAppointment = () => {
  const navigate = useNavigate();
  const { appId } = useParams();
  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [isMedicalDropdownOpen, setIsMedicalDropdownOpen] = useState(false);
  const [isAllergyDropdownOpen, setIsAllergyDropdownOpen] = useState(false);

  const role = localStorage.getItem("role");

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
  });

  const medicalDropdownRef = useRef();
  const allergyDropdownRef = useRef();

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

  // Fetch appointment data on component mount
  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/appointments/getAppointment/${appId}`
        );
        const appointmentData = response.data.appointment;
        
        // Update all state variables with fetched data
        setFormData({
          patientType: appointmentData.patientType || "",
          appId: appointmentData.appId || "",
          patientName: appointmentData.patientName || "",
          gender: appointmentData.gender || "Male",
          mobileNumber: appointmentData.mobileNumber || "",
          age: appointmentData.age || "",
          address: appointmentData.address || "",
          medicalHistory: appointmentData.medicalHistory || [],
          allergies: appointmentData.allergies || [],
          weight: appointmentData.weight || "",
          systolic: appointmentData.systolic || "",
          diastolic: appointmentData.diastolic || "",
          spo2: appointmentData.spo2 || "",
          bloodGroup: appointmentData.bloodGroup || "",
          appointmentDate: appointmentData.appointmentDate ? appointmentData.appointmentDate.split('T')[0] : "",
          appointmentTime: appointmentData.appointmentTime || "",
          doctorName: appointmentData.doctorName || "",
          transactionId: appointmentData.transactionId || "",
          status: appointmentData.status || "",
          paymentMode: appointmentData.paymentMode || "Cash",
          opdAmount: appointmentData.opdAmount || "",
        });
        
        setSelectedMedicalHistory(appointmentData.medicalHistory || []);
        setSelectedAllergies(appointmentData.allergies || []);
        setPaymentMode(appointmentData.paymentMode || "Cash");
        setAppointmentTime(appointmentData.appointmentTime || "");
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointment data:", error);
        toast.error("Failed to fetch appointment data");
        setLoading(false);
      }
    };

    if (appId) {
      fetchAppointmentData();
    }
  }, [appId]);

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    const value = e.target.value;
    setPaymentMode(value);
    setFormData({
      ...formData,
      paymentMode: value
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "patientType",
      "appId",
      "patientName",
      "gender",
      "mobileNumber",
      "age",
      "address",
      "weight",
      "systolic",
      "diastolic",
      "spo2",
      "bloodGroup",
      "appointmentDate",
      "doctorName",
      "status",
    ];

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

    if (paymentMode !== "Cash" && !formData.transactionId) {
      newErrors.transactionId =
        "Transaction ID is required for non-cash payments.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateAppointment = async () => {
    // if (!validateForm()) return;

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_APP_BASE_URL}/appointments/update/${appId}`,
        formData
      );
      console.log("Appointment updated successfully", response.data);
      toast.success("Appointment updated successfully!");
      navigate(`/${role}/appointment-list`);
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading appointment data...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto p-8 bg-gradient-to-br from-white to-teal-50 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">
        Edit Patient Details
      </h2>

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
            <option value="" disabled hidden>
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
            value={formData.appId}
            onChange={handleChange}
            type="text"
            required
            className="w-full p-3 border rounded-xl"
            placeholder="Enter Appointment Id"
            readOnly
          />
          {errors.appId && (
            <p className="text-red-500 text-sm mt-1">{errors.appId}</p>
          )}
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
                  className="bg-teal-100 text-teal-700 text-sm px-2 py-1 rounded-full"
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
            Appointment Date<span className="text-red-500">*</span>
          </label>
          <input
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            type="date"
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
            Appointment Time
          </label>
          <input
            name="appointmentTime"
            type="time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            className="w-full p-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Doctor Name<span className="text-red-500">*</span>
          </label>
          <input
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            type="text"
            placeholder="Enter Doctor"
            className="w-full p-3 border rounded-xl"
          />
          {errors.doctorName && (
            <p className="text-red-500 text-sm mt-1">{errors.doctorName}</p>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mt-10 mb-6 border-b pb-2">
        Payment Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            OPD Amount
          </label>
          <input
            type="Number"
            name="opdAmount"
            value={formData.opdAmount}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Payment Mode
          </label>
          <select
            className="w-full p-3 border rounded-xl"
            value={paymentMode}
            name="paymentMode"
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
          onClick={() => navigate(`/${role}/appointment-list`)}
        >
          Cancel
        </button>
        <button
          className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition text-lg"
          onClick={handleUpdateAppointment}
        >
          Update Appointment
        </button>
      </div>
    </div>
  );
};

export default EditAppointment;