/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppointmentDetails from "./AppointmentDetails";
import { Eye, Edit, CheckCircle, Trash2, Search, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [showAppointment, setShowAppointment] = useState(false);
  const [appointmentData, setAppointmentData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckIn = async (id) => {
    try {
      setIsLoading(true);
      const baseUrl = import.meta.env.VITE_APP_BASE_URL;
      if (!baseUrl)
        throw new Error("API base URL not defined in environment variables");

      const { data } = await axios.patch(
        `${baseUrl}/appointments/updateCheckIn/${id}`
      );
      const appointmentData = data?.appointment;
      if (!appointmentData) {
        toast.error("Appointment not found!");
        return;
      }

      setAppointments((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, isCheckedIn: true } : app
        )
      );

      toast.success("Patient checked in successfully!");
    } catch (error) {
      toast.error(`Check-in failed: ${error.message || "Try again"}`);
    } finally {
      setIsLoading(false);
      setDropdownOpen(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const branchId = localStorage.getItem("selectedBranch");

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const baseUrl = import.meta.env.VITE_APP_BASE_URL;
      if (!baseUrl)
        throw new Error("API base URL not defined in environment variables");

      const response = await axios.get(
        `${baseUrl}/appointments/appointmentList`
      );
      const checkBranch = response.data.appointmentList.filter(
        (patient) => patient.branchId === branchId
      );
      const checkInPatients = response.data.appointmentList.filter(
        (patient) => patient.isPatient === false
      );
      setAppointments(checkBranch || []);
    } catch (error) {
      setError(`Failed to fetch appointments: ${error.message}`);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = (id, event) => {
    if (dropdownOpen === id) {
      setDropdownOpen(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const dropdownHeight = 150;

      let topPosition;
      if (spaceBelow < dropdownHeight) {
        topPosition = rect.top - dropdownHeight;
      } else {
        topPosition = rect.bottom + 5;
      }

      let leftPosition = rect.right - 190;
      if (leftPosition < 10) {
        leftPosition = 10;
      }

      setDropdownPosition({
        top: topPosition,
        left: leftPosition,
      });
      setDropdownOpen(id);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        const baseUrl = import.meta.env.VITE_APP_BASE_URL;
        if (!baseUrl) throw new Error("API base URL not defined");

        await axios.delete(`${baseUrl}/appointments/delete/${id}`);
        fetchAppointments();
        toast.error("Deleted Appointment");
      } catch (error) {
        toast.error(`Delete failed: ${error.message || "Try again"}`);
      } finally {
        setDropdownOpen(null);
      }
    }
  };

  const handleEdit = (appointment) => {
    navigate(`/admin/edit-appointment/${appointment._id}`);
    setDropdownOpen(null);
  };

  const handleView = (appointment) => {
    setShowAppointment(true);
    setAppointmentData(appointment);
    setDropdownOpen(null);
  };

  const filteredAppointments = appointments.filter((app) =>
    Object.values(app).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const tableHeaders = [
    "ID",
    "Name",
    "Contact",
    "Address",
    "Doctor",
    "Time",
    "OPD Amount",
    "Pay Amount",
    "Status",
    "Action",
  ];

  if (isLoading && appointments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-xl">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 md:px-4 py-4">
      <AppointmentDetails
        setShowAppointment={setShowAppointment}
        showAppointment={showAppointment}
        appointmentData={appointmentData}
      />

      <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-0 text-gray-700">
          Appointment List
        </h2>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search patients..."
            className="p-2 pl-10 border rounded w-2/3"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button
            onClick={fetchAppointments}
            className="bg-red-500 text-white px-4 py-1 rounded mt-2 hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="flex flex-col justify-center items-center w-[92%] border bg-white px-4 py-5 rounded-lg shadow">
        <div className="w-full overflow-auto border rounded-lg">
          <div className="min-w-max bg-white shadow-md rounded-lg">
            <div className="h-full overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-teal-900 text-white text-xs sm:text-xs md:text-sm">
                  <tr>
                    {tableHeaders.map((header) => (
                      <th
                        key={header}
                        className="py-3 px-2 md:px-4 whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((app, index) => (
                      <tr
                        key={app._id || index}
                        className={`border-b text-gray-700 hover:bg-gray-100 ${app.isCheckedIn ? "bg-teal-50" : ""
                          }`}
                      >
                        <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                          {app.patientName || "N/A"}
                        </td>
                        <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                          {app.mobileNumber || "N/A"}
                        </td>
                        <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                          {app.address || "N/A"}
                        </td>
                        <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                          {app.doctorName || "N/A"}
                        </td>
                        <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                          {app.appointmentTime || "N/A"}
                        </td>
                        <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                          {app.opdAmount ?? "N/A"}
                        </td>
                        <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                          {app.payAmount ?? app.opdAmount ?? "N/A"}
                        </td>
                        <td className="py-2 px-2 md:px-4 whitespace-nowrap font-semibold">
                          {app.isCheckedIn ? (
                            <span className="text-teal-600">Checked In</span>
                          ) : (
                            <span
                              className={
                                app.status === "Paid"
                                  ? "text-teal-600"
                                  : "text-red-600"
                              }
                            >
                              {app.status || "N/A"}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                          <button
                            className="bg-teal-900 text-white px-3 py-1 rounded-md hover:bg-teal-600"
                            onClick={(e) => toggleDropdown(app._id || index, e)}
                          >
                            Actions
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={tableHeaders.length}
                        className="py-4 text-center text-gray-500"
                      >
                        No appointments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="fixed z-50 bg-white shadow-lg rounded-md border w-48"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
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
                onClick={() =>
                  handleView(
                    appointments.find((app) => app._id === dropdownOpen)
                  )
                }
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white flex items-center gap-2"
              >
                <Eye size={16} />
                <span>View</span>
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  handleEdit(
                    appointments.find((app) => app._id === dropdownOpen)
                  )
                }
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-yellow-500 hover:text-white flex items-center gap-2"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCheckIn(dropdownOpen)}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white flex items-center gap-2"
              >
                <CheckCircle size={16} />
                <span>Check In</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleDelete(dropdownOpen)}
                className="w-full text-left px-4 py-2 text-white bg-red-500 hover:bg-red-600 flex items-center gap-2"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminAppointmentList;




