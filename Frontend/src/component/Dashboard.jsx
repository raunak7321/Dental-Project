import { TrendingUp, Calendar, Users, FileText } from "lucide-react";

const DashboardCard = () => {
  const cards = [
    {
      id: "analytics",
      title: "Analytics",
      description: "View performance metrics and statistics",
      icon: <TrendingUp size={24} className="text-teal-600" />,
      color: "bg-teal-100 hover:bg-teal-200",
      borderColor: "border-teal-300",
      iconColor: "text-teal-500",
    },
    {
      id: "appointments",
      title: "Appointments",
      description: "Manage upcoming patient visits",
      icon: <Calendar size={24} className="text-teal-600" />,
      color: "bg-teal-100 hover:bg-teal-200",
      borderColor: "border-teal-300",
      iconColor: "text-teal-500",
    },
    {
      id: "patients",
      title: "Patients",
      description: "View and manage patient records",
      icon: <Users size={24} className="text-purple-600" />,
      color: "bg-purple-100 hover:bg-purple-200",
      borderColor: "border-purple-300",
      iconColor: "text-purple-500",
    },
    {
      id: "reports",
      title: "Reports",
      description: "Access and generate medical reports",
      icon: <FileText size={24} className="text-red-600" />,
      color: "bg-red-100 hover:bg-red-200",
      borderColor: "border-red-300",
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${card.color} border ${card.borderColor} rounded-lg shadow p-6 transition-all duration-200 transform hover:scale-105`}
          >
            <div className="flex items-center">
              <div
                className={`p-3 rounded-full ${card.iconColor} bg-white mr-4`}
              >
                {card.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {card.title}
                </h2>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCard;
