import React from "react";

const InsuranceTable = ({ insuranceData, onClose, toggleDropdown }) => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Insurance Applicable</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Close
        </button>
      </div>
      <div className="overflow-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse text-sm md:text-base">
          <thead className="bg-teal-900 text-white sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-left whitespace-nowrap">S No</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">
                Company Name
              </th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Address</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Contact</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">
                Applicable
              </th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {insuranceData.map((item, index) => (
              <tr
                key={item.id}
                className="border-b text-gray-700 hover:bg-gray-100"
              >
                <td className="py-2 px-4 whitespace-nowrap">{index + 1}</td>
                <td className="py-2 px-4 whitespace-nowrap">{item.name}</td>
                <td className="py-2 px-4 whitespace-nowrap">{item.address}</td>
                <td className="py-2 px-4 whitespace-nowrap">{item.contact}</td>
                <td className="py-2 px-4 whitespace-nowrap">
                  <select className="border rounded p-1">
                    <option value="Yes" selected={item.applicable === "Yes"}>
                      Yes
                    </option>
                    <option value="No" selected={item.applicable === "No"}>
                      No
                    </option>
                  </select>
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  <button
                    className="bg-teal-900 text-white px-3 py-1 rounded-md hover:bg-teal-600"
                    onClick={(e) => toggleDropdown(`insurance-${item.id}`, e)}
                  >
                    Actions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InsuranceTable;
