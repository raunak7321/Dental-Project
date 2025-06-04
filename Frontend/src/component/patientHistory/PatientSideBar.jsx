import React from "react";
import { useNavigate } from "react-router-dom";

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col mb-2 break-words">
    <span className="text-sm text-gray-500">{label}:</span>
    <span className="text-gray-800 truncate max-w-full">{value || "-"}</span>
  </div>
);

const PatientSidebar = ({ patientData }) => {
  const navigate = useNavigate();

  return (
    <div className="w-70 max-w-full bg-white border-r shadow-md flex-shrink-0">
      <div className="p-4 border-b">
        <button
          onClick={() => navigate(-1)}
          className="text-sm bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded mb-4 transition-all"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800 break-words">
          {patientData.patientName || "Unknown Patient"}
        </h1>
      </div>

      <div className="p-4">
        <h2 className="font-semibold mb-4 text-gray-700 border-b pb-2">
          Basic Info
        </h2>

        <div className="space-y-2">
          <InfoRow label="Patient Type" value={patientData.patientType} />
          <InfoRow label="UHID" value={patientData.uhid} />
          <InfoRow label="Gender" value={patientData.gender} />
          <InfoRow label="Mobile" value={patientData.mobileNumber} />
          {/* <InfoRow label="Email" value={patientData.email} />
          <InfoRow label="DOB" value={patientData.dob} /> */}
          <InfoRow label="Age" value={patientData.age} />
          <InfoRow label="Address" value={patientData.address} />
          {/* <InfoRow label="Aadhaar Number" value={patientData.aadhaarNumber} /> */}
          <InfoRow label="Blood Group" value={patientData.bloodGroup} />
        </div>
      </div>
    </div>
  );
};

export default PatientSidebar;
