import { useEffect, useState } from "react";
import axios from "axios";

const BusinessForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    contact: "",
    licenseNumber: "",
    financialYear: "",
    businessPhoto: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const token = localStorage.getItem("token")
  // console.log(token)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      businessPhoto: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiFormData = new FormData();

      // Append all fields to FormData
      Object.keys(formData).forEach((key) => {
        apiFormData.append(key, formData[key]);
      });

      // API request
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/business/create-business`,
        apiFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      console.log("Business created:", response.data);
      setSubmissionStatus("success");
         window.location.reload();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-md overflow-y-auto max-h-screen">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">
          Business Information
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          type="button"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Business Photo Upload - Reduced height */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Photo
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center py-2">
                {formData.businessPhoto ? (
                  <p className="text-xs text-gray-500 truncate w-full text-center px-2">
                    {formData.businessPhoto.name}
                  </p>
                ) : (
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="text-xs text-gray-500">Upload photo</p>
                  </div>
                )}
              </div>
              <input
                id="businessPhoto"
                name="businessPhoto"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {/* Two-column layout for smaller fields on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Business Name */}
          <div>
            <label
              htmlFor="businessName"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>

          {/* Contact */}
          <div>
            <label
              htmlFor="contact"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Contact
            </label>
            <input
              type="number"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>

          {/* License Number */}
          <div>
            <label
              htmlFor="licenseNumber"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              License Number
            </label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>

          {/* Financial Year */}
          <div>
            <label
              htmlFor="financialYear"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Financial Year
            </label>
            <input
              type="text"
              id="financialYear"
              name="financialYear"
              value={formData.financialYear}
              onChange={handleChange}
              placeholder="YYYY-YYYY"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        {/* Address - Full width */}
        <div>
          <label
            htmlFor="address"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="2"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
            required
          />
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-3 py-2 text-sm text-white font-medium rounded-md ${
              isSubmitting ? "bg-teal-400" : "bg-teal-600 hover:bg-teal-700"
            } focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-teal-500`}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Submission Status */}
        {submissionStatus && (
          <div
            className={`mt-2 p-1 text-sm rounded-md text-center ${
              submissionStatus === "success"
                ? "bg-teal-100 text-teal-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {submissionStatus === "success"
              ? "Business information saved successfully!"
              : "Error saving information. Please try again."}
          </div>
        )}
      </form>
    </div>
  );
};

export default BusinessForm;
