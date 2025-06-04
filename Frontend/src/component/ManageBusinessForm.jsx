import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Eye, Edit, Trash2, Search, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BusinessDetails from "./BusinessDetailsComponet";
import BusinessEditForm from "./BusinessFormEdit";

const BusinessFormManage = ({ onClose }) => {
  const [businesses, setBusinesses] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [showBusiness, setShowBusiness] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [businessData, setBusinessData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
    fetchBusinesses();
    console.log("API Base URL:", import.meta.env.VITE_APP_BASE_URL);
  }, []);

  const fetchBusinesses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/business/getbusiness`
      );
      console.log("API response:", response);
      setBusinesses(response.data || []);
    } catch (error) {
      console.error("Fetch error details:", error.response || error);
      setError(`Failed to fetch businesses: ${error.message}`);
      setBusinesses([]);
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
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/business/deletebusiness/${id}`
      );
      fetchBusinesses();
      toast.error("Business Deleted Successfully");
    } catch (error) {
      console.error("Delete error details:", error.response || error);
      toast.error(`Delete failed: ${error.message || "Try again"}`);
    } finally {
      setDropdownOpen(null);
    }
  };

  const handleEdit = async (id) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/business/getbusinessBy/${id}`
      );
      setBusinessData(data);
      setShowEditForm(true);
    } catch (error) {
      console.error("Edit error details:", error.response || error);
      toast.error(`Failed to get business details: ${error.message}`);
    } finally {
      setDropdownOpen(null);
    }
  };

  const handleView = async (id) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/business/getbusinessBy/${id}`
      );
      setBusinessData(data);
      setShowBusiness(true);
    } catch (error) {
      console.error("View error details:", error.response || error);
      toast.error(`Failed to get business details: ${error.message}`);
    } finally {
      setDropdownOpen(null);
    }
  };

  const filteredBusinesses = businesses.filter((business) =>
    Object.values(business).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const tableHeaders = [
    "ID",
    "Business Name",
    "Address",
    "Contact",
    "License Number",
    "Financial Year",
    "Action",
  ];

  if (isLoading && businesses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-xl">Loading businesses...</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {showBusiness && (
        <BusinessDetails
          setShowBusiness={setShowBusiness}
          showBusiness={showBusiness}
          businessData={businessData}
        />
      )}

      {showEditForm && (
        <BusinessEditForm
          setShowEditForm={setShowEditForm}
          showEditForm={showEditForm}
          businessData={businessData}
          onUpdate={fetchBusinesses}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        {/* <h2 className="text-xl font-bold">Business Management</h2> */}
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Close
        </button>
      </div>

      <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
        <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-0 text-gray-700">
          Business List
        </h3>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search businesses..."
            className="p-2 pl-10 border rounded w-full"
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
            onClick={fetchBusinesses}
            className="bg-red-500 text-white px-4 py-1 rounded mt-2 hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-auto max-h-[70vh]">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead className="bg-teal-900 text-white sticky top-0 z-10">
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header}
                    className="py-3 px-2 md:px-4 text-left whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.length > 0 ? (
                filteredBusinesses.map((business, index) => (
                  <tr
                    key={business._id || index}
                    className="border-b text-gray-700 hover:bg-gray-100"
                  >
                    <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                      {business.businessName || "N/A"}
                    </td>
                    <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                      {business.address || "N/A"}
                    </td>
                    <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                      {business.contact || "N/A"}
                    </td>
                    <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                      {business.licenseNumber || "N/A"}
                    </td>
                    <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                      {business.financialYear || "N/A"}
                    </td>
                    <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                      <button
                        className="bg-teal-900 text-white px-3 py-1 rounded-md hover:bg-teal-600"
                        onClick={(e) =>
                          toggleDropdown(business._id || index, e)
                        }
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
                    No businesses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                onClick={() => handleView(dropdownOpen)}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white flex items-center gap-2"
              >
                <Eye size={16} />
                <span>View</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleEdit(dropdownOpen)}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-yellow-500 hover:text-white flex items-center gap-2"
              >
                <Edit size={16} />
                <span>Edit</span>
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

export default BusinessFormManage;
