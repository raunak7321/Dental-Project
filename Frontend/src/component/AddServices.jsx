import React, { useState } from "react";
import axios from "axios";
import ServiceCard from "./ServiceCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const serviceTypes = [
  { id: 1, title: "Chief Complaint", icon: "🩺", endpoint: "createChief" },
  { id: 2, title: "Examination", icon: "🔍", endpoint: "createExamination" },
  { id: 3, title: "Treatment Procedure", icon: "💊", endpoint: "createTreatment"},
  { id: 4, title: "Medicine", icon: "💉", endpoint: "createMedicine" },
];

const initialFormState = {
  procedureName: "",
  treatmentName: "",
  price: "",
  name: "",
  branchId: localStorage.getItem("selectedBranch"),
};

const AddServices = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeService, setActiveService] = useState("");
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);

  const handleCardClick = (serviceTitle) => {
    setActiveService(serviceTitle);
    setShowForm(true);
    setFormData(initialFormState);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const currentService = serviceTypes.find((s) => s.title === activeService);
    if (!currentService) return;

    const endpoint = `/services/${currentService.endpoint}`;
    let dataToSend = {};

    try {
      if (activeService === "Treatment Procedure") {
        const { procedureName, treatmentName, price } = formData;
        if (!procedureName.trim() || !treatmentName.trim()) return;

        dataToSend = {
          procedureName,
          treatmentName,
          price: price || "0",
          branchId: formData.branchId,
        };
      } else {
        if (!formData.name.trim()) return;
        dataToSend = { name: formData.name, branchId: formData.branchId };
      }

      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}${endpoint}`,
        dataToSend
      );

      // Show success toast notification
      toast.success(`${activeService} created successfully!`);
      setFormData(initialFormState);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating service:", error);
      // Show error toast notification
      toast.error(`Error creating ${activeService}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    id,
    label,
    type = "text",
    required = true,
    placeholder = ""
  ) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={formData[id]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      {activeService === "Treatment Procedure" ? (
        <>
          {renderInput("procedureName", "Procedure Name")}
          {renderInput("treatmentName", "Treatment Name")}
          {renderInput("price", "Price", "number", true, "0.00")}
        </>
      ) : (
        renderInput("name", "Name")
      )}

      <div className="flex justify-center space-x-4 mt-6">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {!showForm && (
        <h2 className="text-2xl font-bold mb-6 text-center">Add Services</h2>
      )}

      {!showForm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceTypes.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              onClick={() => handleCardClick(service.title)}
              showDescription={true}
            />
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Add New {activeService}
          </h3>
          {renderForm()}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AddServices;
