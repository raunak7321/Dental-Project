import React, { useEffect, useState, useRef } from "react";
import { Eye, Pencil, Trash, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageDentist = () => {
  const [dentist, setDentist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const fetchDentist = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/user/getAllUser`
      );
      const receptionists = res.data.user.filter(
        (user) =>
          user.role === "receptionist" &&
          user.opdAmount &&
          user.branchId === localStorage.getItem("selectedBranch")
      );
      setDentist(receptionists);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  useEffect(() => {
    fetchDentist();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleView = (dentist) => {
    setShowModal(true);
    setSelectedDentist(dentist);
  };

  const handleEdit = (dentist) => {
    navigate(`/admin/edit-dentist/${dentist._id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this dentist?")) {
      try {
        const res = await axios.delete(
          `${import.meta.env.VITE_APP_BASE_URL}/user/deleteUserById/${id}`
        );
        if (res.status === 200) {
          toast.success("Dentist deleted successfully!");
          fetchDentist();
        }
      } catch (error) {
        console.error("Error deleting dentist:", error);
        toast.error("Failed to delete dentist. Please try again.");
      }
    }
  };

  const dentistList = Array.isArray(dentist) ? dentist : [];

  const filteredDentists = dentistList.filter((dentist) =>
    Object.values(dentist).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="mx-auto px-4 lg:px-8 py-6 overflow-x-auto max-w-screen-xl">
      <ToastContainer />
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 md:p-10 rounded-lg shadow-2xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Dentist Details</h2>
            <p>
              <strong>Name:</strong> {selectedDentist?.firstName}
            </p>
            <p>
              <strong>Address:</strong> {selectedDentist?.address}
            </p>
            <p>
              <strong>Contact:</strong> {selectedDentist?.contact}
            </p>
            <p>
              <strong>Email:</strong> {selectedDentist?.email}
            </p>
            <button
              className="mt-6 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Dentist</h2>
        <input
          type="text"
          placeholder="Search dentist..."
          className="p-2 border border-gray-300 rounded-md w-1/3 min-w-[200px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-teal-900 text-white">
            <tr>
              <th className="py-3 px-4">S.No</th>
              <th className="py-3 px-4">First Name</th>
              <th className="py-3 px-4">Last Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDentists.length > 0 ? (
              filteredDentists.map((dentist, index) => (
                <tr
                  key={dentist._id || index}
                  className="border-b hover:bg-gray-100"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{dentist.firstName}</td>
                  <td className="py-2 px-4">{dentist.lastName}</td>
                  <td className="py-2 px-4">{dentist.email}</td>
                  <td className="py-2 px-4">{dentist.address}</td>
                  <td className="py-2 px-4">{dentist.phone}</td>
                  <td className="py-3 px-4 relative">
                    <button
                      className="bg-teal-900 text-white px-3 py-1 rounded-md hover:bg-teal-600 flex items-center gap-1"
                      onClick={() => toggleDropdown(dentist._id || index)}
                    >
                      Actions
                    </button>

                    {dropdownOpen === (dentist._id || index) && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-md z-20"
                      >
                        <div className="flex justify-between items-center border-b p-2">
                          <span className="font-semibold">Actions</span>
                          <button
                            onClick={() => setDropdownOpen(null)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <ul className="text-left">
                          <li>
                            <button
                              onClick={() => handleView(dentist)}
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-teal-500 hover:text-white flex items-center gap-2"
                            >
                              <Eye size={16} /> View
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleEdit(dentist)}
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-teal-500 hover:text-white flex items-center gap-2"
                            >
                              <Pencil size={16} /> Edit
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleDelete(dentist._id)}
                              className="w-full px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 flex items-center gap-2"
                            >
                              <Trash size={16} /> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  No dentists available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDentist;
