import React from "react";

const TimeLineTab = ({ treatmentData }) => {
  // Filter treatments that have materialsUsed data
  const treatmentsWithMaterials =
    treatmentData?.filter((treatment) => treatment.materialsUsed) || [];

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div className="bg-white p-4 w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Patient Timeline</h2>
        <p className="text-gray-600">
          Chronological view of materials used in treatments
        </p>
      </div>

      {treatmentsWithMaterials.length > 0 ? (
        <div className="space-y-6">
          {treatmentsWithMaterials.map((treatment, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-lg text-blue-700">
                  Treatment Date: {formatDate(treatment.materialsUsed.date)}
                </h3>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Next Visit: {formatDate(treatment.materialsUsed.nextDate)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700">Tooth Information</p>
                  <p className="text-gray-600">
                    {treatment.materialsUsed.toothName || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700">Procedure Status</p>
                  <p className="text-gray-600">
                    {treatment.materialsUsed.procedureDone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-700">Materials Used</p>
                <p className="text-gray-600">
                  {treatment.materialsUsed.materialsUsed || "None specified"}
                </p>
              </div>

              <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-700">Treatment Notes</p>
                <p className="text-gray-600">
                  {treatment.materialsUsed.notes || "No notes available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 border border-gray-200 rounded-lg">
          <p className="text-gray-500">No materials usage history available</p>
        </div>
      )}
    </div>
  );
};

export default TimeLineTab;
