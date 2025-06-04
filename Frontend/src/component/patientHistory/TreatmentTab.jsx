import React, { useState, useEffect } from "react";

const TreatmentTab = ({ treatmentData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Extract all procedure list items from the treatment data
  const allProcedures =
    treatmentData?.flatMap((item) => item.procedureList || []) || [];

  useEffect(() => {
    // Set loading to false since we're now receiving data directly through props
    setLoading(false);
  }, [treatmentData]);

  if (loading) {
    return <p>Loading treatment plans…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="bg-white p-4 space-y-6 w-full">
      <h2 className="text-lg font-medium text-gray-700 mb-2">Treatment</h2>
      <div className="border border-gray-200 rounded">
        <table className="w-full">
          <thead className="bg-teal-500">
            <tr>
              <th className="py-2 px-4 text-left text-sm text-gray-700">
                Procedure
              </th>
              <th className="py-2 px-4 text-left text-sm text-gray-700">
                Treatment
              </th>
              <th className="py-2 px-4 text-left text-sm text-gray-700">
                Sitting
              </th>
              <th className="py-2 px-4 text-left text-sm text-gray-700">
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {allProcedures.length > 0 ? (
              allProcedures.map((proc, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="py-2 px-4 text-sm">{proc.procedure}</td>
                  <td className="py-2 px-4 text-sm">{proc.treatment}</td>
                  <td className="py-2 px-4 text-sm">{proc.sitting}</td>
                  <td className="py-2 px-4 text-sm">₹{proc.cost}</td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-gray-200">
                <td colSpan="4" className="py-2 px-4 text-sm text-center">
                  No treatment data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TreatmentTab;
