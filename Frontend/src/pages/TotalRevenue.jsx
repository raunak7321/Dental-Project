import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const TotalRevenue = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/invoices/getAllInvoices`
        );
        setInvoices(data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch invoices");
        console.error(err);
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filteredData = invoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.createdAt);
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;

    if (from && invoiceDate < from) return false;
    if (to && invoiceDate > to) return false;
    return true;
  });

  const totalAmount = filteredData.reduce(
    (sum, invoice) => sum + invoice.netPayable,
    0
  );

  
  const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-teal-700 mb-8">Total Revenue</h2>

      <div className="mb-6 flex flex-wrap gap-6 items-end">
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">Loading invoices...</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-md overflow-auto">
            {filteredData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  No invoice data found for the selected date range.
                </p>
              </div>
            ) : (
              <table className="min-w-full text-sm text-center">
                <thead className="bg-teal-700 text-white text-base">
                  <tr>
                    <th className="px-4 py-3">S.no</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Treatment</th>
                    <th className="px-4 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 bg-white">
                  {filteredData.map((invoice, idx) => (
                    <tr
                      key={invoice._id}
                      className="border-b hover:bg-teal-50 transition duration-150"
                    >
                      <td className="px-4 py-3">{idx + 1}</td>
                      <td className="px-4 py-3">
                        {formatDate(invoice.createdAt)}
                      </td>
                      <td className="px-4 py-3">{invoice.patientName}</td>
                      <td className="px-4 py-3">{invoice.mobileNumber}</td>
                      <td className="px-4 py-3">{invoice.doctorName}</td>
                      <td className="px-4 py-3">{invoice.treatmentType}</td>
                      <td className="px-4 py-3 font-semibold text-teal-700">
                        ₹{invoice.netPayable}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-teal-700 text-white px-6 py-2 rounded-md shadow hover:bg-teal-800 transition"
            >
              Back
            </button>

            <div className="bg-white rounded shadow px-6 py-4 text-right text-xl font-semibold text-teal-700">
              Total Revenue: ₹{totalAmount.toLocaleString()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TotalRevenue;
