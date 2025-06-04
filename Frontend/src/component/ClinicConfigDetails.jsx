import React from "react";
import { X } from "lucide-react";

const ClinicConfigDetails = ({ setShowConfig, showConfig, configData }) => {
  if (!showConfig) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-teal-900">
              Clinic Configuration Details
            </h2>
            <button
              onClick={() => setShowConfig(false)}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <h3 className="font-medium text-gray-500">Terms & Conditions</h3>
              <p className="text-gray-800 whitespace-pre-wrap">
                {configData.termsAndCondition || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Share on Mail</h3>
              <p className="text-gray-800">
                {configData.shareOnMail ? "Yes" : "No"}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Creation Date</h3>
              <p className="text-gray-800">
                {configData.createdAt
                  ? new Date(configData.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {configData.headerUrl && (
              <div>
                <h3 className="font-medium text-gray-500 mb-2">
                  Company Header
                </h3>
                <div className="border rounded p-2">
                  <img
                    src={configData.headerUrl}
                    alt="Company Header"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            )}

            {configData.footerUrl && (
              <div>
                <h3 className="font-medium text-gray-500 mb-2">
                  Company Footer
                </h3>
                <div className="border rounded p-2">
                  <img
                    src={configData.footerUrl}
                    alt="Company Footer"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowConfig(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicConfigDetails;
