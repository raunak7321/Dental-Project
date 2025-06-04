/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import "animate.css"; // Import animate.css for animations
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DentalTrialForm = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    DoctorName: "",
    phone: "",
    email: "",
    address: "",
    termsAccepted: false,
    consentGiven: false,
  });

  useEffect(() => {
    if (formData.isApproved && formData.sessionStartDate) {
      const sessionEndDate = new Date(formData.sessionStartDate);
      sessionEndDate.setDate(sessionEndDate.getDate() + 12);

      const today = new Date();
      if (
        today.getFullYear() === sessionEndDate.getFullYear() &&
        today.getMonth() === sessionEndDate.getMonth() &&
        today.getDate() === sessionEndDate.getDate()
      ) {
        toast.error("Your trial session is ending in 3 days. Please renew your session.");
      }
    }
  }, [formData.isApproved, formData.sessionStartDate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAccepted || !formData.consentGiven) {
      toast.success("Please accept terms and consent to proceed.");
      return;
    }

    try {
      setFormData((prevData) => ({
        ...prevData,
        isApproved: true,
        sessionStartDate: new Date(),
      }));

      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/admins/sendOTP`,
        formData
      );

      toast.success("Trial session request submitted. Admin will approve it.");
    } catch (error) {
      console.error("Error submitting trial request:", error);
      toast.error("Failed to submit trial request. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10 border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        🦷 Book a 15-Day Dental Trial Session
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Name */}
        <div>
          <label className="block text-gray-600 font-medium">Client Name</label>
          <input
            type="text"
            name="clientName"
            placeholder="Enter your name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
            onChange={handleChange}
          />
        </div>

        {/* Doctor Name */}
        <div>
          <label className="block text-gray-600 font-medium">Doctor Name</label>
          <input
            type="text"
            name="DoctorName"
            placeholder="Doctor's Name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
            onChange={handleChange}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-gray-600 font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone Number"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-600 font-medium">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-600 font-medium">Address</label>
          <input
            type="text"
            name="address"
            placeholder="Your Address"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
            onChange={handleChange}
          />
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="termsAccepted"
            className="h-5 w-5 text-teal-500"
            onChange={handleChange}
          />
          <label className="text-gray-600">I agree to the Terms & Conditions</label>
        </div>

        {/* Consent */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="consentGiven"
            className="h-5 w-5 text-teal-500"
            onChange={handleChange}
          />
          <label className="text-gray-600">I consent to receive reminders</label>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold p-3 rounded-lg hover:shadow-lg transition duration-300"
        >
          ✅ Book Trial Session
        </motion.button>
      </form>
    </motion.div>
  );
};

export default DentalTrialForm;
