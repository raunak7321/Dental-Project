import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueByService = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedService, setSelectedService] = useState("");
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

  // Extract all unique service descriptions from all invoices
  const allServiceDescriptions = Array.from(
    new Set(
      invoices.flatMap(
        (invoice) =>
          invoice.services?.map((service) => service.description) || []
      )
    )
  );

  // Filter invoices based on date range and selected service
  const filteredInvoices = invoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.createdAt);
    const dateInRange =
      (!startDate || invoiceDate >= startDate) &&
      (!endDate || invoiceDate <= endDate);

    // Check if the invoice contains the selected service
    const hasSelectedService =
      selectedService === "" ||
      invoice.services?.some(
        (service) => service.description === selectedService
      );

    return dateInRange && hasSelectedService;
  });

  // Prepare data for the table view
  const tableData = filteredInvoices.flatMap((invoice) => {
    // If no specific service is selected, return all services in the invoice
    if (selectedService === "") {
      return (
        invoice.services?.map((service) => ({
          date: invoice.createdAt,
          name: invoice.patientName,
          contact: invoice.mobileNumber,
          doctor: invoice.doctorName,
          treatment: service.description,
          amount: service.amount,
          id: `${invoice._id}-${service._id}`,
        })) || []
      );
    }
    // If a specific service is selected, only return matching services
    else {
      return (
        invoice.services
          ?.filter((service) => service.description === selectedService)
          .map((service) => ({
            date: invoice.createdAt,
            name: invoice.patientName,
            contact: invoice.mobileNumber,
            doctor: invoice.doctorName,
            treatment: service.description,
            amount: service.amount,
            id: `${invoice._id}-${service._id}`,
          })) || []
      );
    }
  });

  // Calculate total amount from filtered services
  const totalAmount = tableData.reduce((sum, row) => sum + row.amount, 0);

  // Prepare data for the chart view - total amount per service
  const chartData = allServiceDescriptions.map((description) => {
    const serviceTotal = invoices.reduce((sum, invoice) => {
      const serviceAmount =
        invoice.services
          ?.filter((service) => service.description === description)
          .reduce((serviceSum, service) => serviceSum + service.amount, 0) || 0;
      return sum + serviceAmount;
    }, 0);

    return {
      name: description,
      amount: serviceTotal,
    };
  });

  // Format date to "dd-mm-yy" format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-4 text-teal-700">
        Revenue by Service
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
            dateFormat="dd-MM-yy"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="border px-4 py-2 rounded"
            placeholderText="Select end date"
            dateFormat="dd-MM-yy"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Select Service</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="">All Services</option>
            {allServiceDescriptions.map((description) => (
              <option key={description} value={description}>
                {description}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading invoice data...</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto mb-6">
            {tableData.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600">
                  No data found for the selected filters.
                </p>
              </div>
            ) : (
              <table className="min-w-full border border-gray-300 text-center">
                <thead className="bg-teal-700 text-white">
                  <tr>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Contact</th>
                    <th className="border px-4 py-2">Doctor</th>
                    <th className="border px-4 py-2">Service</th>
                    <th className="border px-4 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <tr key={row.id} className="hover:bg-teal-50">
                      <td className="border px-4 py-2">
                        {formatDate(row.date)}
                      </td>
                      <td className="border px-4 py-2">{row.name}</td>
                      <td className="border px-4 py-2">{row.contact}</td>
                      <td className="border px-4 py-2">{row.doctor}</td>
                      <td className="border px-4 py-2">{row.treatment}</td>
                      <td className="border px-4 py-2 font-semibold text-teal-700">
                        ₹{row.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Total */}
          <div className="text-right font-bold text-xl mb-4 text-teal-700">
            Total: ₹{totalAmount.toLocaleString()}
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="w-full h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                  <Bar dataKey="amount" fill="#2e7e78" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {/* Back Button */}
      <div className="flex justify-start mt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-teal-700 text-white px-6 py-2 rounded-md shadow hover:bg-teal-600 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default RevenueByService;
