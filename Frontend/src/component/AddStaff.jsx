import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddStaff() {
  const navigate = useNavigate();
  const branchId = localStorage.getItem("selectedBranch");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    address: "",
    email: "",
    phone: "",
    role: "receptionist", 
    branchId: branchId,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
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
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL}/user/userRegister`,
          formData
        );

        if (res.status === 200 || res.status === 201) {
          toast.success("Staff added successfully!");
          navigate("/admin/manage-staff");
        } else {
          toast.error("Failed to add staff. Please try again.");
        }
      } catch (error) {
        console.error("Error adding staff:", error);
        toast.error(
          "An error occurred while adding staff. Please try again."
        );
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      password: "",
      address: "",
      email: "",
      phone: "",
      role: "receptionist",
    });
    setErrors({});
    navigate("/admin/manage-staff");
  };

  return (
    <>
      <div className="mx-auto p-8 bg-gradient-to-br from-white to-teal-50 shadow-xl rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">
          Add Staff
        </h2>
        <form className="space-y-4" onSubmit={handleSave}>
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl"
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
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
              required
              className="w-full p-3 border rounded-xl"
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Address<span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl"
              placeholder="Enter address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl"
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Phone Number<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl"
              placeholder="Enter 10-digit phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-start gap-4 pt-4">
            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition text-lg"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition text-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
