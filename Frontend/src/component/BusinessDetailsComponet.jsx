import React from "react";
import { X } from "lucide-react";

const BusinessDetails = ({ setShowBusiness, showBusiness, businessData }) => {
  if (!showBusiness) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-teal-900">
              Business Details
            </h2>
            <button
              onClick={() => setShowBusiness(false)}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-500">Business Name</h3>
              <p className="text-gray-800">
                {businessData.businessName || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Contact</h3>
              <p className="text-gray-800">{businessData.contact || "N/A"}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Address</h3>
              <p className="text-gray-800">{businessData.address || "N/A"}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">License Number</h3>
              <p className="text-gray-800">
                {businessData.licenseNumber || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Financial Year</h3>
              <p className="text-gray-800">
                {businessData.financialYear || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Registration Date</h3>
              <p className="text-gray-800">
                {businessData.createdAt
                  ? new Date(businessData.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {businessData.businessPhoto && businessData.businessPhoto.url && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-500">Business Photo</h3>
              <div className="mt-2">
                <img
                  src={businessData.businessPhoto.url}
                  alt="Business"
                  className="h-48 w-auto object-contain border rounded"
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowBusiness(false)}
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

export default BusinessDetails;
