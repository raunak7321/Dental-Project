import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const toothNames = [
  "Upper Right Second Molar",
  "Upper Right First Molar",
  "Upper Right Canine (Cuspid)",
  "Upper Right Lateral Incisor",
  "Upper Right Central Incisor",
  "Upper Left Central Incisor",
  "Upper Left Lateral Incisor",
  "Upper Left Canine (Cuspid)",
  "Upper Left First Molar",
  "Upper Left Second Molar",
  "Lower Left Second Molar",
  "Lower Left First Molar",
  "Lower Left Canine (Cuspid)",
  "Lower Left Lateral Incisor",
  "Lower Left Central Incisor",
  "Lower Right Central Incisor",
  "Lower Right Lateral Incisor",
  "Lower Right Canine (Cuspid)",
  "Lower Right First Molar",
  "Lower Right Second Molar",
];

const teethData = toothNames.map((name, index) => ({
  id: index + 1,
  label: name,
}));

const FirstPediatricDentistryForm = ({
  patient,
  formData,
  setFormData,
  selectedTeeth,
  setSelectedTeeth,
  records,
  setRecords,
  saved,
  setSaved,
  handleNext,
}) => {
  const navigate = useNavigate();
  const [chiefComplaints, setChiefComplaints] = useState([]);
  const [examinations, setExaminations] = useState([]);
  const [previousTreatmentLoaded, setPreviousTreatmentLoaded] = useState(false);
  const [existingTreatment, setExistingTreatment] = useState(null);

  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (id) => {
    const updated = { ...selectedTeeth, [id]: !selectedTeeth[id] };
    setSelectedTeeth(updated);
    const selected = teethData
      .filter((tooth) => updated[tooth.id])
      .map((tooth) => tooth.label)
      .join(", ");
    setFormData((f) => ({ ...f, toothName: selected }));
  };

  const handleSave = () => {
    const { toothName, dentalCondition, complaint, examination, advice } =
      formData;
    if (!toothName || !dentalCondition || !complaint || !examination || !advice)
      return;

    setRecords([...records, formData]);
    setSelectedTeeth({});
    setSaved(true);
  };

  const handleDelete = (index) => {
    const updated = [...records];
    updated.splice(index, 1);
    setRecords(updated);
  };

  // Fetch existing treatment data based on UHID
  const fetchTreatmentByUHID = async () => {
    if (!patient?.uhid) {
      localStorage.removeItem("treatmentIdReference");
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/treatment/getTreatmentByUHIDId/${patient.uhid}`
      );

      if (response.data.success && response.data.data.length > 0) {
        // Sort treatments by createdAt date in descending order to get the most recent one
        const sortedTreatments = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const latestTreatment = sortedTreatments[0];

        localStorage.setItem("treatmentIdReference", latestTreatment.uhid);
        setExistingTreatment(latestTreatment);
        console.log("Latest treatment:", latestTreatment);

        // Populate form data from the latest treatment
        if (latestTreatment) {
          // Set the saved records from treatment data
          const treatmentRecords = [];

          if (latestTreatment.teethDetails?.length > 0) {
            // Create records from teeth details
            latestTreatment.teethDetails.forEach((tooth) => {
              // Map toothNumber to the index in toothNames array (1-based to 0-based)
              const toothName = toothNames[tooth.toothNumber - 1] || "";

              treatmentRecords.push({
                toothName,
                dentalCondition: tooth.dentalCondition,
                complaint: latestTreatment.chiefComplaint,
                examination: latestTreatment.examinationNotes,
                advice: latestTreatment.advice,
              });

              // Also mark the tooth as selected in the UI
              if (tooth.toothNumber) {
                setSelectedTeeth((prev) => ({
                  ...prev,
                  [tooth.toothNumber]: true,
                }));
              }
            });

            setRecords(treatmentRecords);
            setSaved(treatmentRecords.length > 0);

            // Pre-fill the form with the last treatment's common data
            setFormData({
              toothName: "", // Will be filled when teeth are selected
              dentalCondition: "",
              complaint: latestTreatment.chiefComplaint || "",
              examination: latestTreatment.examinationNotes || "",
              advice: latestTreatment.advice || "",
            });
          }
        }

        setPreviousTreatmentLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching treatment by UHID:", error.message);
    }
  };

  useEffect(() => {
    if (!patient?.uhid || previousTreatmentLoaded) {
      return;
    }

    fetchTreatmentByUHID();
  }, [patient?.uhid, previousTreatmentLoaded]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/services/getAllChief`)
      .then((res) => {
        console.log("Chief Complaint API Response:", res.data);
        if (Array.isArray(res.data.chiefs)) {
          setChiefComplaints(res.data.chiefs);
        }
      })
      .catch((err) =>
        console.error("Error fetching chief complaints:", err.message)
      );

    // Fetch Examinations
    axios
      .get(`${BASE_URL}/services/getAllExamination`)
      .then((res) => {
        console.log("Examination API Response:", res.data);
        if (Array.isArray(res.data.examinations)) {
          setExaminations(res.data.examinations);
        }
      })
      .catch((err) =>
        console.error("Error fetching examinations:", err.message)
      );
  }, []);

  const handleNextClick = async () => {
    if (records.length === 0) {
      alert("Please save at least one treatment record before proceeding.");
      return;
    }

    try {
      const payload = {
        appointmentId: patient?._id,
        uhid: patient?.uhid,
        type: "Pediatric",
        treatments: records.map((rec) => ({
          toothName: rec.toothName,
          dentalCondition: rec.dentalCondition,
        })),
        teethDetails: records.map((rec) => {
          // Try to find tooth number from name
          const tooth = teethData.find((t) => t.label === rec.toothName);
          const toothNumber = tooth ? tooth.id : null;

          return {
            toothNumber: toothNumber,
            toothName: rec.toothName,
            dentalCondition: rec.dentalCondition,
          };
        }),
        chiefComplaint: formData.complaint,
        examinationNotes: formData.examination,
        advice: formData.advice,
        date: new Date().toISOString(),
      };

      let response;
      let treatmentId;

      response = await axios.post(
        `${BASE_URL}/treatment/createTreatmentProcedure`,
        payload
      );
      treatmentId = response.data?.data?._id;

      if (!treatmentId) {
        alert("Could not retrieve treatment ID.");
        return;
      }

      localStorage.setItem("treatmentId", treatmentId);
      localStorage.setItem("treatmentIdReference", patient?.uhid);

      console.log(formData.toothName, "formData.toothNameformData.toothName");
      handleNext(formData.toothName, treatmentId);
      setFormData({
        toothName: "",
        dentalCondition: "",
        complaint: "",
        examination: "",
        advice: "",
      });
    } catch (error) {
      console.error("Error submitting treatment records:", error);
      alert(
        `Error saving treatment data: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Pediatric Examination Dashboard
      </h2>
      {/* Patient Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm md:text-base mb-6">
        <div>
          <strong>Appointment ID:</strong> {patient?.appId}
        </div>
        <div>
          <strong>UHID:</strong> {patient?.uhid}
        </div>
        <div>
          <strong>Name:</strong> {patient?.patientName}
        </div>
        <div>
          <strong>Contact:</strong> {patient?.mobileNumber}
        </div>
        <div>
          <strong>Age:</strong> {patient?.age}
        </div>
        <div>
          {patient?.bp && (
            <div>
              <strong>BP:</strong> {patient.bp.systolic}/{patient.bp.diastolic}{" "}
              mmHg
            </div>
          )}
        </div>
        <div>
          <strong>Medical History:</strong> {patient?.medicalHistory}
        </div>
        <div>
          <strong>Allergies:</strong> {patient?.allergies}
        </div>
        <div>
          <strong>Weight:</strong> {patient?.weight}
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Select Teeth</h2>

      {/* Teeth Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[...Array(6)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 gap-2">
            {teethData.slice(rowIndex * 3, rowIndex * 3 + 3).map((tooth) => (
              <div key={tooth.id} className="flex flex-col items-center p-2">
                <img
                  src={`/pediatricTeeth/tooth${tooth.id}.png`}
                  alt={tooth.label}
                  className="w-12 h-12 mb-1"
                />
                <p className="text-center text-[10px]">{tooth.label}</p>
                <input
                  type="checkbox"
                  checked={selectedTeeth[tooth.id] || false}
                  onChange={() => handleCheckboxChange(tooth.id)}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-5 gap-4">
        <div>
          <label>Tooth Name*</label>
          <input
            name="toothName"
            value={formData.toothName}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
            readOnly
          />
        </div>
        <div>
          <label>Dental Condition*</label>
          <select
            name="dentalCondition"
            value={formData.dentalCondition}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Select</option>
            <option value="Cavity">Cavity</option>
            <option value="Gingivitis">Gingivitis</option>
            <option value="Tooth Decay">Tooth Decay</option>
            <option value="Broken Tooth">Broken Tooth</option>
            <option value="Staining">Staining</option>
            <option value="Impacted Tooth">Impacted Tooth</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Chief Complaint*</label>
          <select
            name="complaint"
            value={formData.complaint}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="">Select</option>
            {chiefComplaints.map((item) => (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Examination*</label>
          <select
            name="examination"
            value={formData.examination}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="">Select</option>
            {examinations.map((item) => (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Advice*</label>
          <input
            name="advice"
            value={formData.advice}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      {/* Buttons: Save and Back */}
      <div className="mt-4 flex justify-between">
        {!saved ? (
          <>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-6 py-2 rounded shadow"
            >
              Back
            </button>
            <button
              onClick={handleSave}
              className="bg-teal-900 text-white px-6 py-2 rounded shadow"
            >
              Save
            </button>
          </>
        ) : (
          <div className="ml-auto">
            <button
              onClick={handleSave}
              className="bg-teal-900 text-white px-6 py-2 rounded shadow"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Saved Table */}
      {records.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Saved Records</h3>
          <table className="w-full text-sm bg-white border border-[#2B7A6F]">
            <thead className="bg-[#2B7A6F] text-white">
              <tr>
                <th className="px-3 py-2 border border-white">Tooth Name</th>
                <th className="px-3 py-2 border border-white">
                  Dental Condition
                </th>
                <th className="px-3 py-2 border border-white">Complaint</th>
                <th className="px-3 py-2 border border-white">Examination</th>
                <th className="px-3 py-2 border border-white">Advice</th>
                <th className="px-3 py-2 border border-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, index) => (
                <tr key={index} className="border border-[#2B7A6F]">
                  <td className="px-3 py-2 border border-[#2B7A6F] text-center">
                    {rec.toothName}
                  </td>
                  <td className="px-3 py-2 border border-[#2B7A6F] text-center">
                    {rec.dentalCondition}
                  </td>
                  <td className="px-3 py-2 border border-[#2B7A6F] text-center">
                    {rec.complaint}
                  </td>
                  <td className="px-3 py-2 border border-[#2B7A6F] text-center">
                    {rec.examination}
                  </td>
                  <td className="px-3 py-2 border border-[#2B7A6F] text-center">
                    {rec.advice}
                  </td>
                  <td className="px-3 py-2 border border-[#2B7A6F] text-center">
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-6 py-2 rounded shadow"
            >
              Back
            </button>
            <button
              onClick={handleNextClick}
              className="bg-teal-600 text-white px-6 py-2 rounded shadow"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstPediatricDentistryForm;
