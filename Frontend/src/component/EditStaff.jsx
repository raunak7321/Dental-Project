import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditStaff() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    address: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch staff data when component mounts
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/user/getUserById/${id}`
        );
        // Update form with existing staff data
        const staffData = response.data;
        setFormData({
          firstName: staffData.firstName || "",
          lastName: staffData.lastName || "",
          password: "",
          address: staffData.address || "",
          email: staffData.email || "",
          phone: staffData.phone || "",
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch staff data. Please try again.");
        setLoading(false);
        console.error("Error fetching staff data:", err);
      }
    };

    fetchStaffData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when the user makes changes
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (formData.password.trim() && formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = "Phone number must be 10 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        // Create data object, only include password if provided
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          email: formData.email,
          phone: formData.phone,
        };

        // Only include password in update if user entered one
        if (formData.password.trim()) {
          updateData.password = formData.password;
        }

        const res = await axios.patch(
          `${import.meta.env.VITE_APP_BASE_URL}/user/updateUserById/${id}`,
          updateData
        );

        if (res.status === 200) {
          toast.success("Staff updated successfully!");
          navigate("/admin/manage-staff");
        } else {
          toast.error("Failed to update staff. Please try again.");
        }
      } catch (error) {
        console.error("Error updating staff:", error);
        toast.error("An error occurred while updating staff. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    navigate("/admin/manage-staff");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Loading staff data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto p-8 bg-red-50 shadow-xl rounded-2xl">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate("/admin/manage-staff")}
          className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-xl"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto p-8 bg-gradient-to-br from-white to-teal-50 shadow-xl rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">
          Edit Staff
        </h2>
        <form className="space-y-4" onSubmit={handleUpdate}>
          {/* Staff Name */}
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
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Username */}
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
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password{" "}
              <span className="text-gray-500">
                (Leave blank to keep current password)
              </span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
              placeholder="Enter new password (min 6 characters)"
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

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Contact Number<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl"
              placeholder="Enter 10-digit contact number"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactNumber}
              </p>
            )}
          </div>

          {/* Update & Cancel Buttons */}
          <div className="flex justify-start gap-4 pt-4">
            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition text-lg"
            >
              Update
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
