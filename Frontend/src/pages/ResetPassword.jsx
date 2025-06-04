import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Bg from "../assets/bg1.png";
import logo from "../assets/logo.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const email = localStorage.getItem("resetEmail");
    if (!email) {
      setError("Email is missing. Please restart the reset process.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/user/resetPassword`, {
        email,
        newPassword,
        confirmPassword,
      });

      localStorage.removeItem("resetEmail");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
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

        <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-green-800">
          Reset Password
        </h3>

        <p className="text-center mb-6 text-sm sm:text-base text-black">
          Set a new password to your account
        </p>

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-base sm:text-lg mb-1 text-green-800">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 rounded-md bg-white text-[#2C7A7B] text-base sm:text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-base sm:text-lg mb-1 text-green-800">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 pr-10 rounded-md bg-white text-[#2C7A7B] text-base sm:text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3/4 transform -translate-y-1/2 cursor-pointer text-black"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {error && (
            <p className="text-red-300 text-sm text-center font-semibold">
              ⚠️ {error}
            </p>
          )}

          <div className="text-sm text-right">
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
            Reset Password
          </button>
        </form>
      </motion.div>
    </div>
  );
}
