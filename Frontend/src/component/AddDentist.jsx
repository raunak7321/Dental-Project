import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const AddDentist = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    opdAmount: "",
    timeSlots: [],
    branchId: localStorage.getItem("selectedBranch") || "01",
    role: "receptionist",
  });

  const [newSlot, setNewSlot] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddTimeSlot = () => {
    if (newSlot.trim() !== "" && !formData.timeSlots.includes(newSlot)) {
      setFormData((prevData) => ({
        ...prevData,
        timeSlots: [...prevData.timeSlots, newSlot],
      }));
      setNewSlot("");
    }
  };

  const handleRemoveSlot = (slotToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      timeSlots: prevData.timeSlots.filter((slot) => slot !== slotToRemove),
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Contact number must be 10 digits";
    }

    if (!formData.opdAmount) {
      newErrors.opdAmount = "OPD Amount is required";
    }

    if (formData.timeSlots.length === 0) {
      newErrors.timeSlots = "At least one time slot is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL}/user/userRegister`,
          formData
        );

        if (res.status === 200 || res.status === 201) {
          toast.success("Dentist added successfully!");
          navigate("/admin/manage-dentist");
        } else {
          toast.error("Failed to add dentist. Please try again.");
        }
      } catch (error) {
        console.error("Error adding dentist:", error);
        toast.error("An error occurred while adding dentist.");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
      email: "",
      password: "",
      opdAmount: "",
      timeSlots: [],
      branchId: localStorage.getItem("selectedBranch") || 1,
      role: "receptionist",
    });
    setErrors({});
    navigate("/admin/manage-staff");
  };

  return (
    <div className="mx-auto p-8 bg-gradient-to-br from-white to-teal-50 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">
        Add Dentist
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            First Name<span className="text-red-500">*</span>
          </label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Last Name<span className="text-red-500">*</span>
          </label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            placeholder="Enter address"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Contact <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            placeholder="Enter contact number"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            placeholder="Enter email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            placeholder="Enter password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* OPD Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            OPD Amount <span className="text-red-500">*</span>
          </label>
          <input
            name="opdAmount"
            type="number"
            value={formData.opdAmount}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            placeholder="Enter OPD Amount"
          />
          {errors.opdAmount && (
            <p className="text-red-500 text-sm">{errors.opdAmount}</p>
          )}
        </div>

        {/* Time Slots */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Time Slots <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              placeholder="e.g. Morning, Evening"
              className="p-2 border rounded-xl flex-1"
            />
            <button
              type="button"
              onClick={handleAddTimeSlot}
              className="bg-teal-500 text-white px-4 py-2 rounded-xl"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.timeSlots.map((slot, index) => (
              <span
                key={index}
                className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full flex items-center"
              >
                {slot}
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(slot)}
                  className="ml-2 text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {errors.timeSlots && (
            <p className="text-red-500 text-sm">{errors.timeSlots}</p>
          )}
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-teal-600 text-white px-6 py-2 rounded-xl hover:bg-teal-700 transition"
          >
            Add Dentist
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddDentist;
