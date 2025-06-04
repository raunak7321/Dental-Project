// src/pages/VerificationCode.jsx
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Bg from "../assets/bg1.png";
import logo from "../assets/logo.png";

export default function VerificationCode() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerification = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("resetEmail"); // retrieved from localStorage
    if (!email) {
      setError("Email not found. Please restart the reset process.");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/user/verifyOtp`, {
        email,
        otp,
      });

      if (res.data.success) {
        navigate("/reset-password");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    }
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-cover bg-center px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${Bg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/0 backdrop-blur-sm text-white w-full max-w-md sm:max-w-lg p-6 sm:p-10 rounded-xl"
      >
        <div className="text-center flex justify-center">
          <img src={logo} className="h-32 sm:h-40" alt="Logo" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-green-800">
          Verification Code Sent
        </h3>

        <p className="text-sm sm:text-base text-center mb-6 text-black">
          A verification code has been sent to your email for password change.
        </p>

        <form onSubmit={handleVerification} className="space-y-5">
          <div>
            <label className="block text-base sm:text-lg mb-2 text-green-800">
              Enter Your Verification Code
            </label>
            <input
              type="text"
              placeholder="Enter your verification code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 rounded-md bg-white text-[#2C7A7B] text-base sm:text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {error && (
            <p className="text-red-300 text-sm text-center font-semibold">
              ⚠️ {error}
            </p>
          )}

          <div className="text-sm text-right text-white">
            <a
              onClick={() => navigate("/login")}
              className="hover:underline cursor-pointer text-green-800"
            >
              Go Back to Login
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-[#2C7A7B] font-semibold py-2 sm:py-3 rounded-md hover:bg-green-500 hover:text-white transition duration-300"
          >
            Submit Code
          </button>
        </form>
      </motion.div>
    </div>
  );
}
