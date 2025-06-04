import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CashlessTreatment = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/receipts/getAllReceipts`
        );

        // Filter for only cashless payments (Card, UPI, etc. - anything that's not Cash)
        const cashlessReceipts = response.data.filter(
          (receipt) => receipt.paymentMode !== "Cash"
        );

        setReceipts(cashlessReceipts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching receipts:", error);
        setLoading(false);
      }
    };
    fetchReceipts();
  }, []);

  const filteredData = receipts.filter((row) => {
    const rowDate = new Date(row.createdAt);
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;

    if (from && rowDate < from) return false;
    if (to && rowDate > to) return false;
    return true;
  });

  const totalAmount = filteredData.reduce(
    (sum, row) => sum + parseFloat(row.totalAmount || 0),
    0
  );

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 bg-[#f4f6f8] min-h-screen">
      <h2 className="text-3xl font-bold text-[#2e7e78] mb-8">
        Cashless Treatment
      </h2>

      <div className="mb-6 flex flex-wrap gap-6 items-end">
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2e7e78]"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2e7e78]"
          />
        </div>

        <div>
          <button
            onClick={resetFilters}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-600">
          Loading cashless treatment data...
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-md overflow-auto">
            <table className="min-w-full text-sm text-center">
              <thead className="bg-[#2e7e78] text-white text-base">
                <tr>
                  <th className="px-4 py-3">S.no</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Treatment</th>
                  <th className="px-4 py-3">Payment Mode</th>
                  <th className="px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 bg-white">
                {filteredData.length > 0 ? (
                  filteredData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b hover:bg-[#e4f3f2] transition duration-150"
                    >
                      <td className="px-4 py-3">{idx + 1}</td>
                      <td className="px-4 py-3">{formatDate(row.createdAt)}</td>
                      <td className="px-4 py-3">{row.patientName}</td>
                      <td className="px-4 py-3">{row.mobileNumber}</td>
                      <td className="px-4 py-3">{row.doctorName}</td>
                      <td className="px-4 py-3">{row.treatmentType}</td>
                      <td className="px-4 py-3">{row.paymentMode}</td>
                      <td className="px-4 py-3 font-semibold text-[#2e7e78]">
                        ₹{row.totalAmount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No cashless treatment data available for the selected date
                      range
                    </td>
                  </tr>
                )}
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
              Total Cashless Revenue: ₹{totalAmount.toFixed(2)}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from(
              new Set(filteredData.map((item) => item.paymentMode))
            ).map((mode, idx) => {
              const modeData = filteredData.filter(
                (item) => item.paymentMode === mode
              );
              const modeTotal = modeData.reduce(
                (sum, item) => sum + parseFloat(item.totalAmount || 0),
                0
              );

              return (
                <div key={idx} className="bg-white p-4 rounded shadow">
                  <h3 className="font-semibold text-lg text-[#2e7e78] mb-2">
                    {mode}
                  </h3>
                  <p>Transactions: {modeData.length}</p>
                  <p className="font-bold">Total: ₹{modeTotal.toFixed(2)}</p>
                  <p>Average: ₹{(modeTotal / modeData.length).toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CashlessTreatment;
