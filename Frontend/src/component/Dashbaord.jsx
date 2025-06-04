import React, { useEffect, useState } from "react";
import Card from "./Card";
import RevenueChart from "./RevenueChart";
import PatientTrends from "./PatientTrends";
import QuickLinks from "./QuickLinks";
import {
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaMoneyBill,
} from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [showRevenue, setShowRevenue] = useState(true);
  const [showTrends, setShowTrends] = useState(true);

  async function fetchDetails() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/admin/dashboardDetails`
      );
      setData(res.data);
      console.log(res, "resssssss");
      console.log(res.data, "datttt");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }

  async function fetchRevenueData() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/invoices/getAllInvoices`
      );

      // Calculate total revenue from invoices (using netPayable)
      const totalRevenue = res.data.reduce(
        (sum, invoice) => sum + (invoice.netPayable || 0),
        0
      );

      // Calculate period-specific revenues
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
      const todayRevenue = todayInvoices.reduce(
        (sum, invoice) => sum + (invoice.netPayable || 0),
        0
      );
      const last7DaysRevenue = last7DaysInvoices.reduce(
        (sum, invoice) => sum + (invoice.netPayable || 0),
        0
      );
      const lastMonthRevenue = lastMonthInvoices.reduce(
        (sum, invoice) => sum + (invoice.netPayable || 0),
        0
      );
      const last3MonthsRevenue = last3MonthsInvoices.reduce(
        (sum, invoice) => sum + (invoice.netPayable || 0),
        0
      );

      setRevenueData({
        total: totalRevenue,
        today: todayRevenue,
        last7Days: last7DaysRevenue,
        lastMonth: lastMonthRevenue,
        last3Months: last3MonthsRevenue,
      });
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  }

  useEffect(() => {
    fetchDetails();
    fetchRevenueData();
  }, []);

  if (!data || !revenueData) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      icon: <FaUserMd className="text-2xl text-teal-500" />,
      title: "Total Doctors",
      count: data.totalDoctors,
      options: data.doctorNames,
    },
    {
      icon: <FaUsers className="text-2xl text-red-500" />,
      title: "Total Patients",
      count: data.totalPatients,
      options: {
        today: data.todayPatients,
        last7Days: data.last7DaysPatients,
        lastMonth: data.lastMonthPatients,
        last3Months: data.last3MonthsPatients,
      },
    },
    {
      icon: <FaCalendarCheck className="text-2xl text-purple-500" />,
      title: "Appointments",
      count: data.totalAppointments,
      options: {
        today: data.todayAppointments,
        last7Days: data.last7DaysAppointments,
        lastMonth: data.lastMonthAppointments,
        last3Months: data.last3MonthsAppointments,
      },
    },
    {
      icon: <FaMoneyBill className="text-2xl text-teal-500" />,
      title: "Total Revenue",
      count: formatCurrency(revenueData.total),
      options: {
        today: formatCurrency(revenueData.today),
        last7Days: formatCurrency(revenueData.last7Days),
        lastMonth: formatCurrency(revenueData.lastMonth),
        last3Months: formatCurrency(revenueData.last3Months),
      },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {cards.map((card, idx) => (
            <Card key={idx} {...card} />
          ))}
        </div>

        {/* Toggleable Charts Section */}
        <div className="grid grid-cols-1 mt-20 lg:grid-cols-2 gap-6">
          {/* Revenue Chart Block */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <button
              className="flex items-center justify-between w-full px-4 py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600"
              onClick={() => setShowRevenue(!showRevenue)}
            >
              <span>Revenue Chart</span>
              {showRevenue ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
            {showRevenue && (
              <div className="mt-4">
                <RevenueChart />
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <button
              className="flex items-center justify-between w-full px-4 py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600"
              onClick={() => setShowTrends(!showTrends)}
            >
              <span>Patient Trends</span>
              {showTrends ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {showTrends && (
              <div className="mt-4">
                <PatientTrends data={data.dailyPatientCounts} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <QuickLinks />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
