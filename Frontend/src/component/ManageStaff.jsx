import React, { useEffect, useState, useRef } from "react";
import { Pencil, Trash, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReusableTable from "./ReusableTable";

export default function ManageStaff() {
  const [staffList, setStaffList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const getStafs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/user/getAllUser`
      );
      const receptionists = res.data.user.filter(
        (user) =>
          user.role === "receptionist" &&
          !user.opdAmount &&
          user.branchId === localStorage.getItem("selectedBranch")
      );
      setStaffList(receptionists);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };   

  useEffect(() => {
    getStafs();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this staff?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/user/deleteUserById/${id}`
      );
      toast.success("Staff deleted successfully!");
      getStafs();
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff. Please try again.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-staff/${id}`);
  };

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  return (
    <div className="mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Staff</h2>
        <input
          type="text"
          placeholder="Search staff..."
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <ReusableTable
        data={staffList}
        dropdownLabels={{
          view: "View",
          edit: "Edit",
          delete: "Delete",
        }}
        customColumns={[
          { key: "firstName", label: "First Name" },
          { key: "lastName", label: "Last Name" },
          { key: "email", label: "Email" },
          { key: "address", label: "Address" },
          { key: "phone", label: "Contact" },
        ]}
        onEdit={(item) => handleEdit(item._id)}
        onDelete={(item) => handleDelete(item._id)}
      />
    </div>
  );
}
