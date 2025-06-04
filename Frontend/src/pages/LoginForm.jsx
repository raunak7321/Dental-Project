import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Bg from "../assets/bg1.png";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [businessDetailsPresent, setBusinessDetailsPresent] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/user/userLogin`,
        { email, password, role }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userDetails", JSON.stringify(res.data.user));
      localStorage.setItem("role", role);
      navigate(role === "admin" ? "/admin/dashboard" : "/receptionist/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4 sm:px-8"
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
        className="w-full max-w-[500px] bg-white/20 backdrop-blur-md rounded-2xl px-6 py-8 sm:px-10 sm:py-12 text-white shadow-lg"
      >
        <div className="text-center mb-6">
          <img src={logo} className="mx-auto h-28 sm:h-36" alt="Logo" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-green-800">
          Login
        </h3>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-base sm:text-lg mb-1 text-green-800">
              Select User
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white text-[#2C7A7B] text-base focus:outline-none"
            >
              <option value="admin">Admin</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>

          <div>
            <label className="block text-base sm:text-lg mb-1 text-green-800">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md bg-white text-[#2C7A7B] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="relative">
            <label className="block text-base sm:text-lg mb-1 text-green-800">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2 pr-10 rounded-md bg-white text-[#2C7A7B] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[60%] -translate-y-1/2 cursor-pointer text-black"
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
              onClick={() => navigate("/forgetpassword")}
              className="hover:underline text-green-800 cursor-pointer"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-[#2C7A7B] font-semibold py-2 rounded-md hover:bg-green-500 hover:text-white transition duration-300"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}
