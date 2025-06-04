import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Eye, Edit, Trash2, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClinicConfigDetails from "./ClinicConfigDetails";

const ClinicTable = ({ onClose }) => {

  const token = localStorage.getItem("token");
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const adminId = decodedToken.id;

  const [formData, setFormData] = useState({
    header: null,
    footer: null,
    termsAndCondition: "",
    shareOnMail: false,
    adminId:adminId
  });

  const [headerPreview, setHeaderPreview] = useState("");
  const [footerPreview, setFooterPreview] = useState("");
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const tableContainerRef = useRef(null);

  // Base URL from env
  const API_ENDPOINT = `${import.meta.env.VITE_APP_BASE_URL}/clinic-config`;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch existing configurations on component mount
  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINT}/getUpload`);
      if (response.data.success) {
        setConfigs(response.data.configurations);
      }
    } catch (error) {
      console.error("Error fetching configurations:", error);
      toast.error("Failed to fetch configurations");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (id, event) => {
    if (dropdownOpen === id) {
      setDropdownOpen(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();

      // Calculate viewport height and check if there's enough space below
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const dropdownHeight = 150; // Approximate height of dropdown

      // Calculate left position (same as before)
      let leftPosition = rect.right - 190;

      // If not enough space below, position above the button
      // Otherwise, position below as before
      let topPosition;
      if (spaceBelow < dropdownHeight) {
        topPosition = rect.top - dropdownHeight;
      } else {
        topPosition = rect.bottom + 5;
      }

      // Ensure the dropdown stays within viewport horizontally
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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Update form data
    setFormData({
      ...formData,
      [type]: file,
    });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "header") {
        setHeaderPreview(reader.result);
      } else if (type === "footer") {
        setFooterPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("adminId", adminId);
      // Make sure files are properly added to FormData
      if (formData.header) {
        formDataToSend.append("header", formData.header);
      }

      if (formData.footer) {
        formDataToSend.append("footer", formData.footer);
      }

      formDataToSend.append(
        "termsAndCondition",
        formData.termsAndCondition || ""
      );
      formDataToSend.append(
        "shareOnMail",
        formData.shareOnMail ? "true" : "false"
      );

      let response;
      if (editingId) {
        response = await axios.put(
          `${API_ENDPOINT}/updateUpload/${editingId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Configuration updated successfully!");
      } else {
        response = await axios.post(
          `${API_ENDPOINT}/createUpload`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Configuration created successfully!");
      }

      if (response.data.success) {
        // Reset form
        setFormData({
          header: null,
          footer: null,
          termsAndCondition: "",
          shareOnMail: false,
          adminId:adminId
        });
        setHeaderPreview("");
        setFooterPreview("");
        setEditingId(null);

        // Refresh configurations list
        fetchConfigurations();
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error(`Operation failed: ${error.message || "Please try again"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/getUpload/${id}`);
      setSelectedConfig(response.data.configuration);
      setShowConfig(true);
    } catch (error) {
      console.error("Error fetching configuration details:", error);
      toast.error("Failed to load configuration details");
    } finally {
      setDropdownOpen(null);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/getUpload/${id}`);
      const config = response.data.configuration;

      setEditingId(id);
      setFormData({
        header: null,
        footer: null,
        termsAndCondition: config.termsAndCondition || "",
        shareOnMail: config.shareOnMail || false,
      });
      setHeaderPreview(config.headerUrl || "");
      setFooterPreview(config.footerUrl || "");
    } catch (error) {
      console.error("Error fetching configuration details:", error);
      toast.error("Failed to load configuration for editing");
    } finally {
      setDropdownOpen(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_ENDPOINT}/deleteUpload/${id}`);
      fetchConfigurations();
      toast.error("Configuration Deleted Successfully");
    } catch (error) {
      console.error("Delete error details:", error.response || error);
      toast.error(`Delete failed: ${error.message || "Try again"}`);
    } finally {
      setDropdownOpen(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      header: null,
      footer: null,
      termsAndCondition: "",
      shareOnMail: false,
    });
    setHeaderPreview("");
    setFooterPreview("");
  };

  // Table headers
  const tableHeaders = [
    "Header",
    "Footer",
    "Terms & Conditions",
    "Share on Mail",
    "Action",
  ];

  return (
    <div className="mt-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {showConfig && (
        <ClinicConfigDetails
          setShowConfig={setShowConfig}
          showConfig={showConfig}
          configData={selectedConfig}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Clinic Configuration</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Close
        </button>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8"
      >
        <h3 className="text-lg font-medium mb-4">
          {editingId ? "Edit Configuration" : "Add New Configuration"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Header Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Header
            </label>
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "header")}
                className="border rounded p-2"
              />
              {headerPreview && (
                <div className="mt-2">
                  <img
                    src={headerPreview}
                    alt="Header preview"
                    className="h-20 object-contain border rounded"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Footer
            </label>
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "footer")}
                className="border rounded p-2"
              />
              {footerPreview && (
                <div className="mt-2">
                  <img
                    src={footerPreview}
                    alt="Footer preview"
                    className="h-20 object-contain border rounded"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms & Conditions
            </label>
            <textarea
              name="termsAndCondition"
              value={formData.termsAndCondition}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
              rows="4"
            ></textarea>
          </div>

          {/* Share on Mail */}
          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="shareOnMail"
                checked={formData.shareOnMail}
                onChange={handleInputChange}
                className="h-4 w-4 mr-2"
              />
              <label className="text-sm font-medium text-gray-700">
                Share on Mail
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="mt-6 flex space-x-3">
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            disabled={loading}
          >
            {loading ? "Processing..." : editingId ? "Update" : "Upload"}
          </button>
        </div>
      </form>

      {/* Configuration List */}
      <div
        className="bg-white shadow-md rounded-lg overflow-hidden"
        ref={tableContainerRef}
      >
        <h3 className="text-lg font-medium p-4 border-b">
          Saved Configurations
        </h3>

        {loading && configs.length === 0 ? (
          <div className="flex justify-center items-center h-24">
            <p className="text-gray-600">Loading configurations...</p>
          </div>
        ) : configs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No configurations found. Add one above.
          </div>
        ) : (
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
                {configs.map((config, index) => (
                  <tr
                    key={config._id || index}
                    className="border-b text-gray-700 hover:bg-gray-100"
                  >
                    <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                      {config.headerUrl ? (
                        <img
                          src={config.headerUrl}
                          alt="Header"
                          className="h-12 w-20 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </td>
                    <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                      {config.footerUrl ? (
                        <img
                          src={config.footerUrl}
                          alt="Footer"
                          className="h-12 w-20 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </td>
                    <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                      <div className="max-w-xs truncate">
                        {config.termsAndCondition || (
                          <span className="text-gray-400 text-sm">None</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                      {config.shareOnMail ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                      <button
                        className="bg-teal-900 text-white px-3 py-1 rounded-md hover:bg-teal-600"
                        onClick={(e) => toggleDropdown(config._id || index, e)}
                      >
                        Actions
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dropdown Actions Menu */}
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

export default ClinicTable;
