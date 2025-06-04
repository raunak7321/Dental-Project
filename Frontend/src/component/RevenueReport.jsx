import React from "react";
import { useNavigate } from "react-router-dom";

const RevenueReport = () => {
  const navigate = useNavigate();

  const revenueCards = [
    { label: "Total Revenue", path: "/admin/revenue/total" },
    { label: "Revenue by Service", path: "/admin/revenue/service" },
    { label: "Revenue by Payment Mode", path: "/admin/revenue/payment" },
    { label: "Cashless Treatment", path: "/admin/renenue/cashless" },
    { label: "Discount / Refund", path: "/admin/revenue/discount" },
    { label: "Total Invoices Generated", path: "/admin/revenue/invoice" },
  ];

  return (
    <div className="p-6 min-h-screen bg-white">
      <h2 className="text-3xl font-bold mb-10 text-center">Revenue Report</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {revenueCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-teal-500 hover:bg-teal-700 text-white hover:text-yellow-300 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out rounded-2xl shadow-lg p-12 h-40 cursor-pointer text-xl font-semibold flex items-center justify-center text-center"
            onClick={() => navigate(card.path)}
          >
            {card.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueReport;
