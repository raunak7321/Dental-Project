import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TotalInvoice = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const data = [
    { date: "2025-04-10", name: "John", contact: "9876543210", doctor: "Dr. Smith", treatment: "Root Canal", amount: 2000 },
    { date: "2025-04-11", name: "Jane", contact: "9123456789", doctor: "Dr. Miller", treatment: "Cleaning", amount: 800 },
    { date: "2025-04-12", name: "Raj", contact: "9001234567", doctor: "Dr. Gupta", treatment: "Filling", amount: 1200 },
  ];

  const filteredData = data.filter(row => {
    const rowDate = new Date(row.date);
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;

    if (from && rowDate < from) return false;
    if (to && rowDate > to) return false;
    return true;
  });

  const totalAmount = filteredData.reduce((sum, row) => sum + row.amount, 0);

  return (
    <div className="p-6 bg-[#f4f6f8] min-h-screen">
      <h2 className="text-3xl font-bold text-[#2e7e78] mb-8">Total invoice</h2>

      <div className="mb-6 flex flex-wrap gap-6 items-end">
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2e7e78]"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2e7e78]"
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-md overflow-auto">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-[#2e7e78] text-white text-base">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Treatment</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 bg-white">
            {filteredData.map((row, idx) => (
              <tr
                key={idx}
                className="border-b hover:bg-[#e4f3f2] transition duration-150"
              >
                <td className="px-4 py-3">{idx + 1}</td>
                <td className="px-4 py-3">{row.date}</td>
                <td className="px-4 py-3">{row.name}</td>
                <td className="px-4 py-3">{row.contact}</td>
                <td className="px-4 py-3">{row.doctor}</td>
                <td className="px-4 py-3">{row.treatment}</td>
                <td className="px-4 py-3 font-semibold text-[#2e7e78]">₹{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-[#2e7e78] text-white px-6 py-2 rounded-md shadow hover:brightness-110 transition"
        >
          Back
        </button>

        <div className="bg-white rounded shadow px-6 py-4 text-right text-xl font-semibold text-[#2e7e78]">
          Total Revenue: ₹{totalAmount}
        </div>
      </div>
    </div>
  );
};

export default TotalInvoice;
