import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const EditDentist = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dentist data when component mounts
  useEffect(() => {
    const fetchDentistData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/dentist/getDentistById/${id}`
        );

        // Update form with existing dentist data
        const dentistData = response.data.dentist;
        setFormData({
          name: dentistData.name || "",
          address: dentistData.address || "",
          contact: dentistData.contact || "",
          email: dentistData.email || "",
          // Note: Password field is left empty for security reasons
          password: "",
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch dentist data. Please try again.");
        setLoading(false);
        console.error("Error fetching dentist data:", err);
      }
    };

    fetchDentistData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.contact.trim()) newErrors.contact = "Contact is required";
    else if (!/^\d{10}$/.test(formData.contact))
      newErrors.contact = "Enter a valid 10-digit number";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Enter a valid email address";

    // Only validate password if it's provided (optional during edit)
    if (formData.password.trim() && !/^\d{6}$/.test(formData.password))
      newErrors.password = "Enter a valid 6-digit password";

    return newErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const updateData = {
        name: formData.name,
        address: formData.address,
        contact: formData.contact,
        email: formData.email,
      };
  
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }
  
      await axios.patch(
        `${import.meta.env.VITE_APP_BASE_URL}/dentist/updateDentistById/${id}`,
        updateData
      );
  
      toast.success("Dentist updated successfully!");
      setTimeout(() => navigate("/admin/manage-dentist"), 2000); // wait for toast to show
    } catch (err) {
      setError("Failed to update dentist information. Please try again.");
      toast.error("Failed to update dentist. Please try again.");
      console.error("Error updating dentist:", err);
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Loading dentist data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto p-8 bg-red-50 shadow-xl rounded-2xl">
           <ToastContainer position="top-right" autoClose={3000} />
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate("/admin/manage-dentist")}
          className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-xl"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto p-8 bg-gradient-to-br from-white to-teal-50 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">
        Edit Dentist
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Name<span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl"
            placeholder="Enter dentist name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Address<span className="text-red-500">*</span>
          </label>
          <input
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

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Contact<span className="text-red-500">*</span>
          </label>
          <input
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl"
            placeholder="10-digit number"
          />
          {errors.contact && (
            <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl"
            placeholder="dentist@gmail.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            placeholder="Enter new password (6 digits)"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition text-lg"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/manage-dentist")}
            className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition text-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDentist;
