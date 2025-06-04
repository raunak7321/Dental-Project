import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const COLORS = ["#3b82f6", "#10b981", "#facc15"]; // blue, green, yellow

const RevenueByPaymentMode = () => {
  const [receipts, setReceipts] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedMode, setSelectedMode] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/receipts/getAllReceipts`
        );
        setReceipts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching receipts:", error);
        setLoading(false);
      }
    };
    fetchReceipts();
  }, []);

  const filteredData = receipts.filter((item) => {
    const itemDate = new Date(item.createdAt);
    const matchMode = selectedMode ? item.paymentMode === selectedMode : true;
    const matchStart = startDate ? itemDate >= startDate : true;
    const matchEnd = endDate ? itemDate <= endDate : true;
    return matchMode && matchStart && matchEnd;
  });

  const getPaymentModes = () => {
    if (receipts.length === 0) return ["Cash", "Card", "UPI"];

    // Extract unique payment modes from the receipts
    const uniqueModes = [...new Set(receipts.map((item) => item.paymentMode))];
    return uniqueModes.length > 0 ? uniqueModes : ["Cash", "Card", "UPI"];
  };

  const paymentModes = getPaymentModes();

  const paymentCounts = paymentModes.map((mode) => ({
    name: mode,
    value: filteredData.filter((item) => item.paymentMode === mode).length,
  }));

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedMode("");
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-4 text-[#2e7b74]">
        Revenue by Payment Mode
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div>
          <label className="block font-medium mb-1">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="border px-4 py-2 rounded"
            placeholderText="Select start date"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="border px-4 py-2 rounded"
            placeholderText="Select end date"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Payment Mode</label>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="">All</option>
            {paymentModes.map((mode, index) => (
              <option key={index} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
        <div className="self-end">
          <button
            onClick={resetFilters}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-300 text-center">
          <thead className="bg-[#2e7b74] text-white">
            <tr>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Contact</th>
              <th className="border px-4 py-2">Doctor</th>
              <th className="border px-4 py-2">Treatment</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Payment Mode</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-3 text-gray-500">
                  Loading data...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, idx) => {
                const isSelected = selectedRow === idx;
                return (
                  <tr
                    key={idx}
                    onClick={() => setSelectedRow(idx)}
                    className={`cursor-pointer transition ${
                      isSelected
                        ? "bg-[#2e7b74] text-white"
                        : "hover:bg-[#e0f5f2] text-[#2e7b74]"
                    }`}
                  >
                    <td className="border px-4 py-2">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">{item.patientName}</td>
                    <td className="border px-4 py-2">{item.mobileNumber}</td>
                    <td className="border px-4 py-2">{item.doctorName}</td>
                    <td className="border px-4 py-2">{item.treatmentType}</td>
                    <td className="border px-4 py-2 font-semibold">
                      ₹{item.totalAmount}
                    </td>
                    <td className="border px-4 py-2">{item.paymentMode}</td>
                    <td className="border px-4 py-2 font-medium">
                      <span
                        className={`${
                          isSelected
                            ? "text-white"
                            : item.paymentStatus === "Paid"
                            ? "text-teal-600"
                            : "text-orange-500"
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-3 text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Back Button (aligned to the left) */}
      <div className="text-left mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-[#2e7b74] text-white px-6 py-2 rounded hover:bg-[#25655f] transition"
        >
          Back
        </button>
      </div>

      {/* Total */}
      <div className="text-right font-bold text-xl mb-4 text-[#2e7b74]">
        Total: ₹
        {filteredData
          .reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0)
          .toFixed(2)}
      </div>

      {/* Pie Chart */}
      {!loading && filteredData.length > 0 && (
        <div className="w-full h-[300px] mb-6">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={paymentCounts}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) =>
                  value > 0 ? `${name}: ${value}` : ""
                }
              >
                {paymentCounts.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} receipt(s)`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Additional Revenue Details */}
      {!loading && filteredData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {paymentModes.map((mode, index) => {
            const modeData = filteredData.filter(
              (item) => item.paymentMode === mode
            );
            const total = modeData.reduce(
              (sum, item) => sum + parseFloat(item.totalAmount || 0),
              0
            );

            return (
              <div key={index} className="bg-gray-50 p-4 rounded shadow">
                <h3 className="font-semibold text-lg text-[#2e7b74] mb-2">
                  {mode} Payments
                </h3>
                <p>Number of transactions: {modeData.length}</p>
                <p className="font-bold">Total amount: ₹{total.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RevenueByPaymentMode;
