import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_BASE_URL}/invoices/getAllInvoices`
        );
        if (!res.ok) throw new Error("Failed to fetch invoices");
        const invoices = await res.json();

        const grouped = groupRevenueByMonth(invoices);
        setMonthlyData(grouped);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const groupRevenueByMonth = (invoices) => {
    const monthlyTotals = new Array(12).fill(0);

    invoices.forEach((invoice) => {
      const date = new Date(invoice.createdAt);
      const month = date.getMonth(); // 0 = Jan, 1 = Feb, ...
      const revenue = invoice.netPayable || 0;
      monthlyTotals[month] += revenue;
    });

    return monthlyTotals;
  };

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div>Error: {error}</div>;

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: monthlyData,
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20, 184, 166, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.raw.toLocaleString()}`,
        },
      },
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Revenue (Jan - Dec)",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Revenue (₹)",
        },
        ticks: {
          callback: (value) => `₹${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h3 className="text-lg font-semibold mb-4 text-emerald-600">
        Revenue by Month
      </h3>
      <div className="h-[350px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default RevenueChart;
