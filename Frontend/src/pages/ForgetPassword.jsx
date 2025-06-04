import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Bg from "../assets/bg1.png"; 
import logo from "../assets/logo.png"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function ForgetPassword() {
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [error, setError] = useState("");

  const handleResetRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/user/forgetPassword`,
        { email: emailOrPhone }
      );
      localStorage.setItem("resetEmail", emailOrPhone);
      toast.success("Reset link sent to your email!");
      navigate("/verification-code");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
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
          <img src={logo} className="h-40" alt="Logo" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-green-800">
          Forgot Password
        </h3>

        <p className="text-sm sm:text-base text-center mb-6 text-black">
          Enter your registered email to receive a password reset link.
        </p>

        <form onSubmit={handleResetRequest} className="space-y-5">
          <div>
            <label className="block text-base sm:text-lg mb-2 text-green-800">
              Email Address 
            </label>
            <input
              type="text"
              placeholder="example@domain.com"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white text-[#2C7A7B] text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div className="flex items-center justify-between text-sm text-white">
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
            Send OTP
          </button>
        </form>
      </motion.div>
    </div>
  );
}
