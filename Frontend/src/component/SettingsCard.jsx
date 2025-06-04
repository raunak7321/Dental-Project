import React from "react";

const SettingsCard = ({ card, onClick }) => {
  return (
    <div
      className={`${card.color} border ${card.borderColor} rounded-lg shadow p-6 cursor-pointer transition-all duration-200 transform hover:scale-105`}
      onClick={() => onClick(card.id)}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${card.iconColor} bg-white mr-4`}>
          {card.icon}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{card.title}</h2>
          <p className="text-gray-600 text-sm">
            Click to manage {card.title.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
