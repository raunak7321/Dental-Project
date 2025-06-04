import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditBranches = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch branch data when component mounts
  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/branch/getBranchById/${id}`
        );

        // Update form with existing branch data
        const branchData = response.data.branch;
        setFormData({
          name: branchData.name || "",
          address: branchData.address || "",
          contact: branchData.contact || "",
          pincode: branchData.pincode || "",
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch branch data. Please try again.");
        setLoading(false);
        console.error("Error fetching branch data:", err);
      }
    };

    fetchBranchData();
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
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode";
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
      await axios.patch(
        `${import.meta.env.VITE_APP_BASE_URL}/branch/updateBranchById/${id}`,
        formData
      );

      toast.success("Branch updated successfully!");
      navigate("/admin/manage-branches");
    } catch (err) {
      setError("Failed to update branch. Please try again.");
      console.error("Error updating branch:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Loading branch data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto p-8 bg-red-50 shadow-xl rounded-2xl">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate("/admin/manage-branches")}
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
        Edit Branch
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
            placeholder="Enter branch name"
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

        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Pincode<span className="text-red-500">*</span>
          </label>
          <input
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-xl"
            placeholder="6-digit pincode"
          />
          {errors.pincode && (
            <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/manage-branches")}
            className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition text-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition text-lg"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBranches;
