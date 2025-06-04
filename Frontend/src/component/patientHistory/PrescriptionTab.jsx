import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PrescriptionTab = ({ prescriptionData, patientData }) => {
  // For debugging - display raw data
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Check if prescription data exists and has content
  const hasPrescriptions =
    prescriptionData && Object.keys(prescriptionData).length > 0;

  // Function to manually trigger prescription fetch for troubleshooting
  const retryFetchPrescription = async () => {
    try {
      const patientId = patientData?._id || "unknown";
      const apiUrl = `${
        import.meta.env.VITE_APP_BASE_URL
      }/prescriptions/getPrescriptionByExaminationById/${patientId}`;

      toast.info(`Attempting to fetch from: ${apiUrl}`);
      console.log("Patient data:", patientData);

      const response = await axios.get(apiUrl);
      console.log("Manual prescription fetch response:", response.data);

      if (response.data.success && response.data.data) {
        toast.success("Successfully fetched prescription data");
        // Update state to show the new data
        window.location.reload(); // Force refresh to update state
      } else {
        toast.warning(
          `API response: ${response.data.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Manual fetch error:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-teal-700">Prescriptions</h2>
       
      </div>

      {!hasPrescriptions ? (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">
            No prescription records found for this patient.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Current Medications</h3>
          </div>

          <div className="divide-y">
            {Array.isArray(prescriptionData) ? (
              prescriptionData.map((prescription, index) => (
                <div key={index} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">
                        {prescription.medicationName || "Unnamed Medication"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {prescription.dosage || "No dosage information"} •
                        {prescription.frequency || "No frequency information"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        Prescribed:{" "}
                        {prescription.prescribedDate
                          ? new Date(
                              prescription.prescribedDate
                            ).toLocaleDateString()
                          : "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500">
                        By: {prescription.prescribedBy || "Unknown doctor"}
                      </p>
                    </div>
                  </div>

                  {prescription.instructions && (
                    <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                      <span className="font-medium">Instructions:</span>{" "}
                      {prescription.instructions}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      {prescriptionData.medicationName || "Unnamed Medication"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {prescriptionData.dosage || "No dosage information"} •
                      {prescriptionData.frequency || "No frequency information"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      Prescribed:{" "}
                      {prescriptionData.prescribedDate
                        ? new Date(
                            prescriptionData.prescribedDate
                          ).toLocaleDateString()
                        : "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      By: {prescriptionData.prescribedBy || "Unknown doctor"}
                    </p>
                  </div>
                </div>

                {prescriptionData.instructions && (
                  <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                    <span className="font-medium">Instructions:</span>{" "}
                    {prescriptionData.instructions}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionTab;
