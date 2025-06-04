import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ServiceCard from "./ServiceCard";
import ServiceDetailsModal from "./ServiceDetailsModal";
import ReusableTable from "./ReusableTable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageServices = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalData, setViewModalData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);
  const modalRef = useRef(null);
  const baseURL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }

      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
        setEditingService(null);
        setDropdownOpen(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const serviceTypes = [
    {
      id: 1,
      title: "Chief Complaint",
      icon: "🩺",
      endpoint: "/getAllChief",
      deleteEndpoint: "/deleteChiefById/",
      getByIdEndpoint: "/getChiefById/",
      updateEndpoint: "/updateChiefById/",
    },
    {
      id: 2,
      title: "Examination",
      icon: "🔍",
      endpoint: "/getAllExamination",
      deleteEndpoint: "/deleteExaminationById/",
      getByIdEndpoint: "/getExaminationById/",
      updateEndpoint: "/updateExaminationById/",
    },
    {
      id: 3,
      title: "Treatment Procedure",
      icon: "💊",
      endpoint: "/getAllTreatment",
      deleteEndpoint: "/deleteTreatmentById/",
      getByIdEndpoint: "/getTreatmentById/",
      updateEndpoint: "/updateTreatmentById/",
    },
    {
      id: 4,
      title: "Medicine",
      icon: "💉",
      endpoint: "/getAllMedicine",
      deleteEndpoint: "/deleteMedicineById/",
      getByIdEndpoint: "/getMedicineById/",
      updateEndpoint: "/updateMedicineById/",
    },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchServices = async (categoryTitle) => {
    setLoading(true);
    setError(null);
    try {
      const category = serviceTypes.find(
        (type) => type.title === categoryTitle
      );
      if (!category) throw new Error("Category not found");
      const response = await axios.get(
        `${baseURL}/services${category.endpoint}`
      );
      const key = Object.keys(response.data).find((k) =>
        Array.isArray(response.data[k])
      );

      const filteredServices = response.data[key].filter(
        (service) => service.branchId === localStorage.getItem("selectedBranch")
      );

      setServices(filteredServices || []);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (title) => {
    setActiveCategory(title);
    setIsModalOpen(true);
    fetchServices(title);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDropdownOpen(null);
    setEditingService(null);
  };

  const handleViewService = (service) => {
    setViewModalData(service);
  };

  const handleEditService = (service) => {
    setEditingService(service);
  };

  const handleSaveEdit = async () => {
    try {
      const category = serviceTypes.find(
        (type) => type.title === activeCategory
      );
      const endpoint = `${baseURL}/services${category.updateEndpoint}${editingService._id}`;
      await axios.patch(endpoint, editingService);

      toast.success("Service updated successfully!");

      setEditingService(null);
      setIsModalOpen(false);
      setDropdownOpen(null);

      fetchServices(activeCategory);

      console.log("After Save:", editingService);
    } catch (err) {
      console.error("Error updating service:", err);
      toast.error("Update failed. Please try again.");
    }
  };

  const handleInputChange = (e, key) => {
    setEditingService({ ...editingService, [key]: e.target.value });
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this Service?")) {
      try {
        const category = serviceTypes.find(
          (type) => type.title === activeCategory
        );
        await axios.delete(
          `${baseURL}/services${category.deleteEndpoint}${serviceId._id}`
        );
        toast.success("Service deleted successfully!");
        setIsModalOpen(false);
        setDropdownOpen(null);
        setEditingService(null);
        fetchServices(activeCategory);
      } catch (err) {
        console.error("Error deleting service:", err);
        toast.error("Delete failed. Please try again.");
      }
    }
  };

  const getCustomColumns = () => {
    if (services.length === 0) return [];
    return Object.keys(services[0])
      .filter((key) => key !== "__v" && key !== "_id")
      .map((key) => ({
        key,
        label:
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
      }));
  };

  return (
    <div
      className={`p-6 max-w-6xl mx-auto ${
        dropdownOpen ? "blurred-background" : ""
      }`}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {serviceTypes.map((service) => (
          <ServiceCard
            key={service.id}
            icon={service.icon}
            title={service.title}
            onClick={() => handleCardClick(service.title)}
            showDescription={false}
          />
        ))}
      </div>

      {isModalOpen && (
        <div className="flex items-center justify-center fixed inset-0 z-50 backdrop-blur-xs">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded shadow-lg w-full max-w-3xl "
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {activeCategory} Services
              </h2>
              <button
                onClick={closeModal}
                className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded"
              >
                ✕
              </button>
            </div>

            {editingService ? (
              <EditServiceForm
                service={editingService}
                onSave={handleSaveEdit}
                onCancel={() => setEditingService(null)}
                onChange={handleInputChange}
              />
            ) : (
              <ReusableTable
                data={services}
                loading={loading}
                error={error}
                onView={handleViewService}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                dropdownRef={dropdownRef}
                customColumns={getCustomColumns()}
                headerClassName="bg-teal-900 text-white"
                dropdownClassName="absolute top-0 right-0 z-10 mt-2 bg-white shadow-lg rounded-lg p-2"
              />
            )}
          </div>
        </div>
      )}

      {viewModalData && (
        <ServiceDetailsModal
          data={viewModalData}
          onClose={() => setViewModalData(null)}
        />
      )}
    </div>
  );
};

const EditServiceForm = ({ service, onSave, onCancel, onChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Edit Service</h3>
      <div className="space-y-4">
        {Object.entries(service)
          .filter(([key]) => key !== "__v" && key !== "_id")
          .map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium mb-1 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={value || ""}
                onChange={(e) => onChange(e, key)}
              />
            </div>
          ))}
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
          onClick={onSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ManageServices;
