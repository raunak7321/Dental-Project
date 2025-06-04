import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReceptionDashboard = () => {
  const [data, setData] = useState(null);
  const [collectionData, setCollectionData] = useState({
    total: 0,
    today: 0,
    last7Days: 0,
    lastMonth: 0,
    last3Months: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/receptionist/dashboardDetails`
        );
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard details:", error);
      }
    };

    const fetchCollectionData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/invoices/getAllInvoices`
        );

        // Calculate total collection from invoices
        const totalCollection = res.data.reduce(
          (sum, invoice) => sum + (invoice.netPayable || 0),
          0
        );

        // Calculate period-specific collections
        const today = new Date();
        const todayString = today.toDateString();

        // Filter invoices for today
        const todayInvoices = res.data.filter((invoice) => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoiceDate.toDateString() === todayString;
        });

        // Filter invoices for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        const last7DaysInvoices = res.data.filter((invoice) => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoiceDate >= sevenDaysAgo;
        });

        // Filter invoices for last month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        const lastMonthInvoices = res.data.filter((invoice) => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoiceDate >= oneMonthAgo;
        });

        // Filter invoices for last 3 months
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        const last3MonthsInvoices = res.data.filter((invoice) => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoiceDate >= threeMonthsAgo;
        });

        // Calculate net amounts for each period
        const todayCollection = todayInvoices.reduce(
          (sum, invoice) => sum + (invoice.netPayable || 0),
          0
        );
        const last7DaysCollection = last7DaysInvoices.reduce(
          (sum, invoice) => sum + (invoice.netPayable || 0),
          0
        );
        const lastMonthCollection = lastMonthInvoices.reduce(
          (sum, invoice) => sum + (invoice.netPayable || 0),
          0
        );
        const last3MonthsCollection = last3MonthsInvoices.reduce(
          (sum, invoice) => sum + (invoice.netPayable || 0),
          0
        );

        setCollectionData({
          total: totalCollection,
          today: todayCollection,
          last7Days: last7DaysCollection,
          lastMonth: lastMonthCollection,
          last3Months: last3MonthsCollection,
        });
      } catch (error) {
        console.error("Error fetching collection data:", error);
      }
    };

    fetchDashboardData();
    fetchCollectionData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!data || !collectionData) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  const {
    upcomingAppointments = [],
    totalAppointments = 0,
    totalPatients = 0,
  } = data;

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {/* Buttons Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Book Appointment", path: "receptionist/add-appointment" },
          { label: "Receipt", path: "receptionist/reception-patient" },
          { label: "Invoice Generate", path: "receptionist/invoiceform" },
          { label: "Calendar", path: "" },
        ].map((btn, idx) => (
          <button
            key={idx}
            className="bg-teal-500 text-white py-2 px-4 rounded-xl shadow hover:bg-teal-600 transition-colors"
            onClick={() => navigate(`/${btn.path}`)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Today Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-300 p-4 rounded-xl shadow text-center">
          <h3 className="text-gray-500 text-sm mb-1">Today's Appointments</h3>
          <p className="text-2xl font-semibold">{totalAppointments}</p>
        </div>
        <div className="bg-gray-300 p-4 rounded-xl shadow text-center">
          <h3 className="text-gray-500 text-sm mb-1">Today's Patients</h3>
          <p className="text-2xl font-semibold">{totalPatients}</p>
        </div>
        <div className="bg-gray-300 p-4 rounded-xl shadow text-center">
          <h3 className="text-gray-500 text-sm mb-1">Today's Collection</h3>
          <p className="text-2xl font-semibold">
            ₹{collectionData.today.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Collection Stats */}
      {/* <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">Collection Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border p-3 rounded-lg">
            <h3 className="text-gray-500 text-sm">Total Collection</h3>
            <p className="text-xl font-semibold">
              {formatCurrency(collectionData.total)}
            </p>
          </div>
          <div className="border p-3 rounded-lg">
            <h3 className="text-gray-500 text-sm">Last 7 Days</h3>
            <p className="text-xl font-semibold">
              {formatCurrency(collectionData.last7Days)}
            </p>
          </div>
          <div className="border p-3 rounded-lg">
            <h3 className="text-gray-500 text-sm">Last Month</h3>
            <p className="text-xl font-semibold">
              {formatCurrency(collectionData.lastMonth)}
            </p>
          </div>
          <div className="border p-3 rounded-lg">
            <h3 className="text-gray-500 text-sm">Last 3 Months</h3>
            <p className="text-xl font-semibold">
              {formatCurrency(collectionData.last3Months)}
            </p>
          </div>
        </div>
      </div> */}

      {/* Appointments */}
      <div className="bg-gray-300 shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-300">
              <tr>
                <th className="border-b p-2">S.No.</th>
                <th className="border-b p-2">Patient</th>
                <th className="border-b p-2">Contact</th>
                <th className="border-b p-2">Doctor</th>
                <th className="border-b p-2">Payment</th>
              </tr>
            </thead>
            <tbody>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appt, index) => (
                  <tr key={index} className="">
                    <td className="p-2 border-b">{index + 1}</td>
                    <td className="p-2 border-b">{appt.patientName}</td>
                    <td className="p-2 border-b">{appt.mobileNumber}</td>
                    <td className="p-2 border-b">{appt.doctorName}</td>
                    <td className="p-2 border-b">{appt.paymentMode}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No upcoming appointments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
