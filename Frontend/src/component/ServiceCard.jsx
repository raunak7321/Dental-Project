import React from "react";

const ServiceCard = ({ icon, title, onClick, showDescription = false }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300 border border-gray-200"
      onClick={onClick}
    >
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
        {showDescription && (
          <p className="text-gray-600 mt-2">Click to add</p>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
