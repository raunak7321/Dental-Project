import React from "react";

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "appointment", label: "Appointment" },
    { id: "treatment", label: "Treatment" },
    { id: "billing", label: "Billing" },
    // { id: "clinical", label: "Clinical Examine" },
    { id: "prescription", label: "Prescription" },
    { id: "timeline", label: "TimeLine" },
    { id: "files", label: "Files" },
  ];

  return (
    <div className="border text-black flex overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
            activeTab === tab.id
              ? "text-Black  bg-white border rounded"
              : "text-white hover:text-black"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
