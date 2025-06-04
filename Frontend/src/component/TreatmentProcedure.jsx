import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TreatmentProcedure({
  id,
  patient,
  finalProcedures,
  setFinalProcedures,
  finalTreatmentRecords,
  setFinalTreatmentRecords,
  setShowTreatment,
  setRecords,
  toothName,
  chiefComplaint = "",
  examinationNotes = "",
  advice = "",
}) {
  const [procedureList, setProcedureList] = useState([]);
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [procedureForm, setProcedureForm] = useState({
    procedure: "",
    treatment: "",
    sitting: "",
    cost: "",
  });
  const [procedureErrors, setProcedureErrors] = useState({});
  const [treatmentOptions, setTreatmentOptions] = useState([]);
  const [toothOptions, setToothOptions] = useState([]);
  const [todayProcedure, setTodayProcedure] = useState({
    date: new Date().toISOString().split("T")[0],
    toothName: "",
    procedureDone: "",
    materialsUsed: "",
    notes: "",
    nextDate: "",
  });
  const [todayProceduresList, setTodayProceduresList] = useState([]); // Add new state for today's procedures list
  const [todayErrors, setTodayErrors] = useState({});
  const navigate = useNavigate();
  const { examinationId } = useParams();
  const [medicineList, setMedicineList] = useState([]);
  const [medicineForm, setMedicineForm] = useState({
    name: "",
    frequency: "",
    beforeFood: "yes",
    afterFood: "no",
    duration: "",
    instructions: "",
  });
  const [medicineErrors, setMedicineErrors] = useState({});
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [previousTreatmentData, setPreviousTreatmentData] = useState(null);
  const [selectedTeeth, setSelectedTeeth] = useState({});

  // Fetch previous treatment data if patient exists
  useEffect(() => {
    const fetchPreviousTreatmentData = async () => {
      const refUhid = localStorage.getItem("treatmentIdReference");
      if (!refUhid || refUhid == "") return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/treatment/getTreatmentByUHIDId/${refUhid}`
        );
        const sortedTreatments = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const latestTreatment = sortedTreatments[1];

        if (latestTreatment && latestTreatment._id) {
          setPreviousTreatmentData(latestTreatment);
          // Populate form states with previous data
          populateFromPreviousData(latestTreatment);
        }
      } catch (error) {
        console.error("Error fetching previous treatment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousTreatmentData();
  }, [patient, BASE_URL]);

  console.log("Previous Treatment Data:", previousTreatmentData);
  console.log("Patient:", patient);

  // Function to populate form states from previous data
  const populateFromPreviousData = (data) => {
    // Populate procedure list if available
    if (
      data.procedureList &&
      Array.isArray(data.procedureList) &&
      data.procedureList.length > 0
    ) {
      setProcedureList(data.procedureList);
    }

    // Populate medicine list if available
    if (
      data.medicines &&
      Array.isArray(data.medicines) &&
      data.medicines.length > 0
    ) {
      setMedicineList(data.medicines);
    }

    // Populate today's procedure if available
    if (data.materialsUsed) {
      const nextDate = data.materialsUsed.nextDate
        ? new Date(
            data.materialsUsed.nextDate.$date || data.materialsUsed.nextDate
          )
            .toISOString()
            .split("T")[0]
        : "";

      const procedureDate = data.materialsUsed.date
        ? new Date(data.materialsUsed.date.$date || data.materialsUsed.date)
            .toISOString()
            .split("T")[0]
        : new Date().toISOString().split("T")[0];

      setTodayProcedure({
        date: procedureDate,
        toothName: data.materialsUsed.toothName || toothName,
        procedureDone: data.materialsUsed.procedureDone || "",
        materialsUsed: data.materialsUsed.materialsUsed || "",
        notes: data.materialsUsed.notes || "",
        nextDate: nextDate,
      });
    }

    // If final procedures exist in previously saved data, set them
    if (
      data.treatments &&
      Array.isArray(data.treatments) &&
      data.treatments.length > 0
    ) {
      setFinalProcedures(data.treatments);
      setFinalTreatmentRecords(data.treatments);
    }
  };

  useEffect(() => {
    setTodayProcedure((prev) => ({
      ...prev,
      toothName: toothName,
    }));
  }, [toothName]);

  const updateSave = async () => {
    const treatmentId = localStorage.getItem("treatmentId");

    if (!treatmentId) {
      toast.error(
        "No treatment ID found. Please create a treatment record first."
      );
      return;
    }

    const data = {
      procedureList: procedureList,
      medicines: medicineList,
      materialsUsed: todayProcedure,
    };

    try {
      const response = await axios.patch(
        `${BASE_URL}/treatment/updateTreatmentById/${treatmentId}`,
        data
      );

      console.log("Response from updateSave:", response.data);
      if (response.status === 200) {
        toast.success("Data saved successfully!");
      } else {
        toast.error("Failed to save data.");
      }
    } catch (error) {
      console.error("Error updating treatment data:", error);
      toast.error("Failed to save data. Please try again.");
    }
  };

  const validateProcedureForm = () => {
    const errors = {};
    if (!procedureForm.procedure) errors.procedure = "Procedure is required";
    if (!procedureForm.treatment) errors.treatment = "Treatment is required";
    if (!procedureForm.sitting) errors.sitting = "Sitting is required";
    setProcedureErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const fetchTreatmentData = async () => {
      if (!id) return;

      try {
        const treatmentsResponse = await axios.get(
          `${BASE_URL}/services/getAllTreatment`
        );
        setTreatmentOptions(treatmentsResponse.data.treatments);
      } catch (error) {
        console.error("Error fetching treatment data:", error);
        toast.error("Failed to fetch treatment options");
      }
    };

    fetchTreatmentData();
  }, [id, BASE_URL]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/services/getAllMedicine`);
        setMedicineOptions(response.data.medicines || []);
      } catch (error) {
        console.error("Error fetching medicines:", error);
        toast.error("Failed to fetch medicine options");
      }
    };

    fetchMedicines();
  }, [BASE_URL]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        const filtered = medicineOptions.filter((med) =>
          med.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setMedicineOptions(filtered);
      } else {
        axios
          .get(`${BASE_URL}/services/getAllMedicine`)
          .then((res) => setMedicineOptions(res.data.medicines || []))
          .catch((err) => {
            console.error("Error fetching medicines:", err);
            toast.error("Failed to fetch medicine options");
          });
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, BASE_URL]);

  const handleProcedureChange = (e) => {
    const selectedProcedureName = e.target.value;

    const selectedTreatment = treatmentOptions.find(
      (treatment) => treatment.treatmentName === selectedProcedureName
    );

    if (selectedTreatment) {
      setProcedureForm({
        ...procedureForm,
        procedure: selectedTreatment.treatmentName,
        treatment: selectedTreatment.procedureName,
        cost: selectedTreatment.price || "",
      });
    } else {
      setProcedureForm({
        ...procedureForm,
        procedure: selectedProcedureName,
        treatment: "",
        cost: "",
      });
    }
  };

  const handleProcedureSave = () => {
    if (!validateProcedureForm()) return;
    setProcedureList((prev) => [...prev, procedureForm]);
    setProcedureForm({
      procedure: "",
      treatment: "",
      sitting: "",
      cost: "",
    });
    setProcedureErrors({});
  };

  const handleDeleteTodayProcedure = (index) => {
    setTodayProceduresList((prev) => prev.filter((_, i) => i !== index));

    // Also remove from finalProcedures
    setFinalProcedures((prev) => {
      // This is a simplified approach. In a real app, you might need a more robust way to identify which items to remove
      const updatedProcedures = [...prev];
      updatedProcedures.splice(index, 1);
      return updatedProcedures;
    });
  };

  const handleTodayProcedureSave = () => {
    if (!validateTodayProcedure()) return;

    // Create a new today's procedure record
    const newTodayProcedure = {
      ...todayProcedure,
      procedureDone: procedureList
        .map((p) => `${p.procedure} - ${p.treatment} (Cost: ${p.cost})`)
        .join(", "),
    };

    // Add to today's procedures list
    setTodayProceduresList((prev) => [...prev, newTodayProcedure]);

    // Add to final procedures
    setFinalProcedures((prev) => [...prev, newTodayProcedure]);

    // Reset today's procedure form
    setTodayProcedure({
      date: new Date().toISOString().split("T")[0],
      toothName: toothName,
      procedureDone: "",
      materialsUsed: "",
      notes: "",
      nextDate: "",
    });

    // Clear the procedure list
    setProcedureList([]);

    // Clear errors
    setTodayErrors({});

    toast.success("Today's procedure saved successfully!");
  };

  const validateTodayProcedure = () => {
    const errors = {};
    if (!todayProcedure.date) errors.date = "Date is required";
    if (!todayProcedure.toothName) errors.toothName = "Tooth name is required";
    if (!todayProcedure.materialsUsed)
      errors.materialsUsed = "Materials used is required";
    if (!todayProcedure.nextDate) errors.nextDate = "Next date is required";
    if (procedureList.length === 0)
      errors.procedureDone = "At least one procedure must be added";
    setTodayErrors(errors);
    return Object.keys(errors).length === 0;
  };
  // Save only the procedure data
  const handleFinalSave = async () => {
    if (!validateTodayProcedure()) return;

    setLoading(true);

    const selectedToothNames = Object.entries(selectedTeeth)
      .filter(([_, selected]) => selected)
      .map(([id]) => `Tooth ${id}`);

    const procedures = procedureList
      .map((p) => `${p.procedure} - ${p.treatment} (Cost: ${p.cost})`)
      .join(", ");

    const record = {
      date: todayProcedure.date || new Date().toLocaleDateString(),
      toothName: selectedToothNames.join(", ") || todayProcedure.toothName,
      procedureDone: procedures,
      materialsUsed: todayProcedure.materialsUsed,
      notes: todayProcedure.notes,
      nextDate: todayProcedure.nextDate,
    };

    // Add to state
    const updatedProcedures = [...finalProcedures, record];
    setFinalProcedures(updatedProcedures);
    setFinalTreatmentRecords(updatedProcedures);

    // Only attempt to save to backend if we have an examinationId
    const examinationId = localStorage.getItem("treatmentId");
    console.log("Examination ID:", examinationId);

    if (examinationId) {
      try {
        const response = await axios.patch(
          `${BASE_URL}/treatment/updateTreatmentProcedureById/${examinationId}`,
          {
            treatments: updatedProcedures,
            chiefComplaint,
            examinationNotes,
            advice,
          }
        );
        console.log("Treatment procedure updated successfully:", response);
        toast.success("Procedure saved successfully!");
      } catch (error) {
        console.error("Error updating treatment procedure", error);
        toast.error("Failed to save procedure to backend");

        // Save to localStorage as fallback
        localStorage.setItem(
          `treatment_procedure_${examinationId}`,
          JSON.stringify({
            treatments: updatedProcedures,
            timestamp: new Date().toISOString(),
          })
        );
        toast.info("Saved procedure locally. Please try again later.");
      }
    } else {
      // Save to localStorage if no examinationId
      localStorage.setItem(
        "temp_treatment_procedure",
        JSON.stringify({
          treatments: updatedProcedures,
          timestamp: new Date().toISOString(),
        })
      );
      toast.info(
        "Saved procedure locally. Please create an examination record first."
      );
    }

    // Reset form
    setTodayProcedure({
      date: new Date().toISOString().split("T")[0],
      toothName: toothName,
      procedureDone: "",
      materialsUsed: "",
      notes: "",
      nextDate: "",
    });
    setTodayErrors({});
    setProcedureList([]);
    setLoading(false);
  };

  // Save all data (procedure + medicines)
  const handleFinalSaveAll = async () => {
    if (!validateTodayProcedure()) return;

    setLoading(true);

    const selectedToothNames = Object.entries(selectedTeeth)
      .filter(([_, selected]) => selected)
      .map(([id]) => `Tooth ${id}`);

    const procedures = procedureList
      .map((p) => `${p.procedure} - ${p.treatment} (Cost: ${p.cost})`)
      .join(", ");

    const record = {
      date: todayProcedure.date || new Date().toLocaleDateString(),
      toothName: selectedToothNames.join(", ") || todayProcedure.toothName,
      procedureDone: procedures,
      materialsUsed: todayProcedure.materialsUsed,
      notes: todayProcedure.notes,
      nextDate: todayProcedure.nextDate,
    };

    // Add to state
    const updatedProcedures = [...finalProcedures, record];
    setFinalProcedures(updatedProcedures);
    setFinalTreatmentRecords(updatedProcedures);

    // Complete treatment data with medicines
    const treatmentData = {
      treatments: updatedProcedures,
      medicines: medicineList,
      patientId: patient?.id || id,
      chiefComplaint,
      examinationNotes,
      advice,
    };

    // Only attempt to save to backend if we have an examinationId
    const treatmentId = localStorage.getItem("treatmentId") || examinationId;

    if (treatmentId) {
      try {
        const response = await axios.patch(
          `${BASE_URL}/treatment/update/${treatmentId}`,
          treatmentData
        );
        console.log("All treatment data updated successfully:", response);
        toast.success("All treatment data saved successfully!");

        // Navigate to patient treatment page
        navigate("/patient-treatment");
      } catch (error) {
        console.error("Error updating all treatment data", error);
        toast.error("Failed to save all treatment data to backend");

        // Save to localStorage as fallback
        localStorage.setItem(
          `complete_treatment_${treatmentId}`,
          JSON.stringify({
            ...treatmentData,
            timestamp: new Date().toISOString(),
          })
        );
        toast.info("Saved all treatment data locally. Please try again later.");
      }
    } else {
      // Save to localStorage if no treatmentId
      localStorage.setItem(
        "temp_complete_treatment",
        JSON.stringify({
          ...treatmentData,
          timestamp: new Date().toISOString(),
        })
      );
      toast.info(
        "Saved all treatment data locally. Please create an examination record first."
      );

      // Navigate to patient treatment page
      navigate("/patient-treatment");
    }

    // Reset forms
    setTodayProcedure({
      date: new Date().toISOString().split("T")[0],
      toothName: toothName,
      procedureDone: "",
      materialsUsed: "",
      notes: "",
      nextDate: "",
    });
    setTodayErrors({});
    setProcedureList([]);
    setMedicineList([]);
    setLoading(false);
  };

  const validateMedicineForm = () => {
    const errors = {};
    if (!medicineForm.name) errors.name = "Name is required";
    if (!medicineForm.frequency) errors.frequency = "Frequency is required";
    if (!medicineForm.duration) errors.duration = "Duration is required";
    setMedicineErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleMedicineAdd = () => {
    if (!validateMedicineForm()) return;
    setMedicineList((prev) => [...prev, medicineForm]);
    setMedicineForm({
      name: "",
      frequency: "",
      beforeFood: "yes",
      afterFood: "no",
      duration: "",
      instructions: "",
    });
    setMedicineErrors({});
  };

  const handleDeleteProcedure = (index) => {
    setProcedureList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteMedicine = (index) => {
    setMedicineList((prev) => prev.filter((_, i) => i !== index));
  };

  // If needed, load saved data from localStorage on component mount
  useEffect(() => {
    if (examinationId) {
      const localData = localStorage.getItem(
        `treatment_procedure_${examinationId}`
      );
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          // Check if data is recent (within last 24 hours)
          const timestamp = new Date(parsedData.timestamp);
          const now = new Date();
          const hoursDiff = (now - timestamp) / (1000 * 60 * 60);

          if (hoursDiff < 24 && parsedData.treatments?.length) {
            // Confirm with user before loading local data
            const confirmLoad = window.confirm(
              "We found unsaved treatment data from your previous session. Would you like to load it?"
            );

            if (confirmLoad) {
              setFinalProcedures(parsedData.treatments);
              setFinalTreatmentRecords(parsedData.treatments);
              toast.info("Loaded previously unsaved treatment data");

              // Try to save to backend
              handleSyncLocalData();
            } else {
              // Clear local storage if user declines
              localStorage.removeItem(`treatment_procedure_${examinationId}`);
            }
          }
        } catch (error) {
          console.error("Error parsing local treatment data:", error);
        }
      }
    }
  }, [examinationId]);

  // Function to sync local data with backend
  const handleSyncLocalData = async () => {
    if (!examinationId) return;

    const localData = localStorage.getItem(
      `treatment_procedure_${examinationId}`
    );
    if (!localData) return;

    try {
      const parsedData = JSON.parse(localData);

      const response = await axios.patch(
        `${BASE_URL}/treatment/update/${examinationId}`,
        {
          treatments: parsedData.treatments,
          chiefComplaint,
          examinationNotes,
          advice,
        }
      );

      console.log("Synced local treatment data to backend:", response);
      toast.success("Successfully synced local treatment data to server");

      // Clear local storage after successful sync
      localStorage.removeItem(`treatment_procedure_${examinationId}`);
    } catch (error) {
      console.error("Error syncing local treatment data:", error);
      toast.error("Failed to sync local treatment data to server");
    }
  };

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="p-6 ml-10 bg-white">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Treatment Procedure
        </h2>

        {previousTreatmentData && (
          <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded">
            <h3 className="text-lg font-semibold text-teal-700">
              Previous Treatment Data Loaded
            </h3>
            <p className="text-sm text-gray-600">
              Previous treatment data has been loaded and populated in the form.
            </p>
          </div>
        )}

        {/* Procedure Section */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block mb-1">Procedure</label>
            <select
              value={procedureForm.procedure}
              onChange={handleProcedureChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Treatment</option>
              {treatmentOptions.map((treatment) => (
                <option key={treatment._id} value={treatment.treatmentName}>
                  {treatment.treatmentName}
                </option>
              ))}
            </select>

            {procedureErrors.procedure && (
              <p className="text-red-500 text-sm">
                {procedureErrors.procedure}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">Treatment</label>
            <input
              value={procedureForm.treatment}
              readOnly
              className="border px-2 py-1 rounded w-full bg-gray-100"
            />
            {procedureErrors.treatment && (
              <p className="text-red-500 text-sm">
                {procedureErrors.treatment}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">Sitting</label>
            <input
              value={procedureForm.sitting}
              onChange={(e) =>
                setProcedureForm({ ...procedureForm, sitting: e.target.value })
              }
              className="border px-2 py-1 rounded w-full"
            />
            {procedureErrors.sitting && (
              <p className="text-red-500 text-sm">{procedureErrors.sitting}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Cost</label>
            <input
              value={procedureForm.cost}
              className="border px-2 py-1 rounded w-full bg-gray-100"
              readOnly
            />
          </div>
        </div>

        <button
          onClick={handleProcedureSave}
          className="text-white px-6 py-1 mb-4 rounded"
          style={{
            backgroundColor: "#2B7A6F",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#24675F")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#2B7A6F")
          }
        >
          Save Procedure
        </button>

        {/* Procedure Table */}

        {procedureList.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-teal-700">
              Saved Procedure List
            </h3>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full text-sm text-left border border-teal-200">
                <thead className="bg-teal-600 text-white">
                  <tr>
                    <th className="px-4 py-2 border border-teal-200">
                      Procedure
                    </th>
                    <th className="px-4 py-2 border border-teal-200">
                      Treatment
                    </th>
                    <th className="px-4 py-2 border border-teal-200">
                      Sitting
                    </th>
                    <th className="px-4 py-2 border border-teal-200">Cost</th>
                    <th className="px-4 py-2 border border-teal-200">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-gray-700">
                  {procedureList.map((item, index) => (
                    <tr key={index} className="hover:bg-teal-50 transition">
                      <td className="px-4 py-2 border border-teal-200 text-center">
                        {item.procedure}
                      </td>
                      <td className="px-4 py-2 border border-teal-200 text-center">
                        {item.treatment}
                      </td>
                      <td className="px-4 py-2 border border-teal-200 text-center">
                        {item.sitting}
                      </td>
                      <td className="px-4 py-2 border border-teal-200 text-center">
                        {item.cost}
                      </td>
                      <td
                        className="px-4 py-2 border border-teal-200 text-center text-red-600 font-medium cursor-pointer"
                        onClick={() => handleDeleteProcedure(index)}
                      >
                        Delete
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <hr className="my-6" />

        <h3 className="text-2xl font-semibold mb-2 text-gray-600">
          Medicine Prescription
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <label className="block mb-1">Name</label>
            <div className="relative">
              <select
                value={medicineForm.name}
                onChange={(e) =>
                  setMedicineForm({ ...medicineForm, name: e.target.value })
                }
                className="appearance-none border px-2 py-1 rounded w-full pr-8"
              >
                <option value="">Select Medicine</option>
                {medicineOptions.map((medicine) => (
                  <option key={medicine._id} value={medicine.name}>
                    {medicine.name}
                  </option>
                ))}
              </select>
              {/* Dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {medicineErrors.name && (
              <p className="text-red-500 text-sm">{medicineErrors.name}</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Frequency</label>
            <input
              value={medicineForm.frequency}
              onChange={(e) =>
                setMedicineForm({ ...medicineForm, frequency: e.target.value })
              }
              className="border px-2 py-1 rounded w-full"
            />
            {medicineErrors.frequency && (
              <p className="text-red-500 text-sm">{medicineErrors.frequency}</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Before Food</label>
            <select
              value={medicineForm.beforeFood}
              onChange={(e) =>
                setMedicineForm({ ...medicineForm, beforeFood: e.target.value })
              }
              className="border px-2 py-1 rounded w-full"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>

            {medicineErrors.beforeFood && (
              <p className="text-red-500 text-sm">
                {medicineErrors.beforeFood}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1">After Food</label>
            <select
              value={medicineForm.afterFood}
              onChange={(e) =>
                setMedicineForm({ ...medicineForm, afterFood: e.target.value })
              }
              className="border px-2 py-1 rounded w-full"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {medicineErrors.afterFood && (
              <p className="text-red-500 text-sm">{medicineErrors.afterFood}</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Duration</label>
            <input
              value={medicineForm.duration}
              onChange={(e) =>
                setMedicineForm({ ...medicineForm, duration: e.target.value })
              }
              className="border px-2 py-1 rounded w-full"
            />
            {medicineErrors.duration && (
              <p className="text-red-500 text-sm">{medicineErrors.duration}</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Instructions</label>
            <input
              value={medicineForm.instructions}
              onChange={(e) =>
                setMedicineForm({
                  ...medicineForm,
                  instructions: e.target.value,
                })
              }
              className="border px-2 py-1 rounded w-full"
            />
            {medicineErrors.instructions && (
              <p className="text-red-500 text-sm">
                {medicineErrors.instructions}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleMedicineAdd}
          className="text-white px-6 py-1 mb-4 rounded"
          style={{
            backgroundColor: "#2B7A6F",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#24675F")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#2B7A6F")
          }
        >
          Add Medicine
        </button>

        {/* Medicine List in Simple Format */}
        {medicineList.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-teal-700">
              Prescribed Medicines
            </h3>
            <div className="space-y-2">
              {medicineList.map((med, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded border flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{med.name}</p>
                    <p className="text-sm text-gray-600">
                      {med.frequency}, {med.duration} days
                    </p>
                    <p className="text-sm text-gray-600">
                      {med.beforeFood === "yes" && "Before food"}
                      {med.beforeFood === "yes" &&
                        med.afterFood === "yes" &&
                        ", "}
                      {med.afterFood === "yes" && "After food"}
                    </p>
                    {med.instructions && (
                      <p className="text-sm text-gray-600">
                        Instructions: {med.instructions}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteMedicine(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <hr className="my-6" />
        <h3 className="text-2xl font-semibold mb-2 text-gray-600">
          Today Procedure
        </h3>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {Object.entries(todayProcedure).map(([key, value]) => (
            <div key={key}>
              <label className="block mb-1 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>

              {key === "toothName" ? (
                <input
                  type="text"
                  value={value}
                  disabled
                  className="border px-2 py-1 rounded w-full bg-gray-100 text-gray-700"
                />
              ) : key.toLowerCase().includes("date") ? (
                <input
                  type="date"
                  value={
                    key.toLowerCase().includes("next")
                      ? value || ""
                      : value || new Date().toISOString().split("T")[0]
                  }
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setTodayProcedure({
                      ...todayProcedure,
                      [key]: e.target.value,
                    })
                  }
                  className="border px-2 py-1 rounded w-full"
                />
              ) : (
                <input
                  value={value}
                  onChange={(e) =>
                    setTodayProcedure({
                      ...todayProcedure,
                      [key]: e.target.value,
                    })
                  }
                  className="border px-2 py-1 rounded w-full"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          {/* <button
          onClick={handleFinalSave}
          className="bg-teal-500 text-white px-6 py-2 rounded mb-6"
        >
          Save Today's Procedure
        </button> */}
          <button
            onClick={() => navigate(-0)}
            className="bg-gray-500 text-white px-6 py-2 rounded mb-6"
          >
            Back
          </button>
          <button
            onClick={updateSave}
            className="bg-teal-500 text-white px-6 py-2 rounded mb-6"
          >
            Save ALL
          </button>
        </div>
        {/* Final Treatment Records Table */}

        {finalProcedures.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-teal-700">
              Saved Final Procedures
            </h3>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full text-sm text-left border border-teal-200">
                <thead className="bg-teal-600 text-white">
                  <tr>
                    <th className="px-4 py-2 border border-teal-200">Date</th>
                    <th className="px-4 py-2 border border-teal-200">
                      Tooth Name
                    </th>
                    <th className="px-4 py-2 border border-teal-200">
                      Procedure Done
                    </th>
                    <th className="px-4 py-2 border border-teal-200">
                      Materials Used
                    </th>
                    <th className="px-4 py-2 border border-teal-200">Notes</th>
                    <th className="px-4 py-2 border border-teal-200">
                      Next Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white text-gray-700">
                  {finalProcedures.map((item, index) => (
                    <tr key={index} className="hover:bg-teal-50 transition">
                      <td className="px-4 py-2 border border-teal-200 text-center">
                        {item.date}
                      </td>
                      <td className="px-4 py-2 border border-teal-200 text-center">
                        {item.toothName}
                      </td>
                      <td className="px-4 py-2 border border-teal-200 text-center">
                        {item.procedureDone}
                      </td>
                      <td className="px-4 py-2 border border-teal-200 text-center">
                        {item.materialsUsed}
                      </td>
                      <td className="px-4 py-2 border border-teal-200 text-center">
                        {item.notes}
                      </td>
                      <td className="px-4 py-2 border border-teal-200 text-center">
                        {item.nextDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
