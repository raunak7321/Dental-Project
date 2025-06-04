import React from "react";

const ServiceDetailsModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Item Details</h2>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded"
          >
            ✕
          </button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(data)
                  .filter((key) => key !== "__v" && key !== "_id")
                  .map((key) => (
                    <th 
                      key={key} 
                      className="px-4 py-3 text-left text-sm font-medium text-gray-600 capitalize"
                    >
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                {Object.keys(data)
                  .filter((key) => key !== "__v" && key !== "_id")
                  .map((key) => (
                    <td key={key} className="px-4 py-3 text-sm text-gray-800">
                      {data[key]}
                    </td>
                  ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;