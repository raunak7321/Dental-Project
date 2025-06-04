import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Bg from "../assets/bg1.png";
import logo from "../assets/logo.png";

export default function SuccessfullyReset() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/login");
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
        <div className="text-center flex justify-center mb-4">
          <img src={logo} className="h-32 sm:h-40" alt="Logo" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-green-800">
          Password Reset Successful
        </h3>

        <p className="text-center text-sm sm:text-base mb-6 text-black">
          You can now login with your new password.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <button
            type="submit"
            className="w-full bg-white text-[#2C7A7B] font-semibold py-2 sm:py-3 rounded-md hover:bg-green-500 hover:text-white transition duration-300"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}
