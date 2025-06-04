/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Eye, Edit, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PatientListHistory = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = React.useRef(null);
  const navigate = useNavigate();

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) =>
      patient.patientName?.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [search, patients]);
  const branchId = localStorage.getItem("selectedBranch");

  const fetchPatientDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/appointments/appointmentList`
      );
      const checkInPatients = response.data.appointmentList.filter(
        (patient) => patient.isPatient === true && patient.branchId === branchId
      );
      setPatients(checkInPatients);
    } catch (err) {
      setError("Failed to fetch patient details: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientDetails();
  }, []);

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this patient?")) {
      console.log("Cancelling patient with ID:", id);
      toast.error("Patient cancelled");
    }
  };

  const toggleDropdown = (id, event) => {
    if (dropdownOpen === id) {
      setDropdownOpen(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 5,
        left: Math.min(rect.right - 190, window.innerWidth - 200),
      });
      setDropdownOpen(id);
    }
  };

  const handleAction = (action, patientId) => {
    const patient = patients.find((p) => p.appId === patientId);
    if (!patient) return;

    switch (action) {
      case "view":
        navigate(`/admin/procedure-selection/${patient.appId}`);
        break;
      case "edit":
        navigate(`/admin/PrescriptionForm/${patient.appId}`);
        break;
      case "delete":
        toast.error(`Delete action for patient ${patientId}`);
        break;
      default:
        break;
    }
    setDropdownOpen(null);
  };

  const tableHeaders = [
    "App ID",
    "UHID",
    "Name",
    "Age",
    "Weight",
    "Medical History",
    "Allergies",
    "SPO2",
    "Blood Group",
    ""
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-xl">Loading patients...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Patient History</h2>
        <div className="relative w-full md:w-1/3 max-w-md">
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button
            onClick={fetchPatientDetails}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Retry
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow max-w-full">
        <table className="min-w-full text-xs sm:text-sm md:text-base border-collapse">
          <thead className="bg-teal-900 text-white sticky top-0 z-10">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header}
                  className="py-3 px-4 text-left whitespace-nowrap text-xs sm:text-sm"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <tr
                  key={patient._id || index}
                  className="border-b hover:bg-gray-100 text-gray-700"
                >
                  <td className="py-2 px-2 sm:px-4">
                    {patient.appId || "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:px-4">{patient.uhid || "N/A"}</td>
                  <td className="py-2 px-2 sm:px-4">
                    {patient.patientName || "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:px-4">{patient.age || "N/A"}</td>
                  <td className="py-2 px-2 sm:px-4">
                    {(patient.weight || "N/A") + (patient.weight ? " kg" : "")}
                  </td>
                  <td className="py-2 px-2 sm:px-4">
                    {patient.medicalHistory?.join(", ") || "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:px-4">
                    {patient.allergies?.join(", ") || "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:px-4">{patient.spo2 || "N/A"}</td>
                  <td className="py-2 px-2 sm:px-4">
                    {patient.bloodGroup || "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:px-4 whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/admin/patient-history/${patient._id}`)}
                      className="bg-teal-600 text-white px-3 py-1 rounded-md hover:bg-teal-700 text-sm"
                    >
                      View History
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="text-center py-4 text-gray-500"
                >
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
                  onClick={() => handleAction("view", dropdownOpen)}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white flex items-center gap-2"
                >
                  <Eye size={16} />
                  <span>Start Procedure</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAction("edit", dropdownOpen)}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-yellow-500 hover:text-white flex items-center gap-2"
                >
                  <Edit size={16} />
                  <span>Prescription</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAction("delete", dropdownOpen)}
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
    </div>
  );
};

export default PatientListHistory;
