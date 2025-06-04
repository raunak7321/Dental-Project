import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

// Helper function to convert camelCase keys to readable format
const formatLabel = (key) => {
  const map = {
    today: 'Today',
    last7Days: 'Last 7 Days',
    lastMonth: 'Last Month',
    last3Months: 'Last 3 Months',
  };
  return map[key] || key;
};

const Card = ({ icon, title, link, options, count }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOptionKey, setSelectedOptionKey] = useState('');

  const handleCardClick = () => {
    if (link && !dropdownOpen) {
      navigate(link);
    }
  };

  const handleOptionClick = (key) => {
    setSelectedOptionKey(key);
    setDropdownOpen(false);
  };

  // Dynamic count based on selected option (fallback to prop count if none selected)
  const displayCount = selectedOptionKey && options
    ? options[selectedOptionKey]
    : count;

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-105 h-[220px] relative"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        {/* Icon and Title */}
        <div className="flex items-center space-x-3">
          <div>{icon}</div>
          <div className="text-lg font-semibold">{title}</div>
        </div>

        {/* Dropdown Trigger */}
        {options && typeof options === 'object' && (
          <div className="relative">
            <button
              className="rounded-md w-8 h-8 flex items-center justify-center hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen((prev) => !prev);
              }}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 max-h-40 overflow-y-auto bg-white shadow-lg rounded-md z-10">
                {Object.entries(options).map(([key, value]) => (
                  <button
                    key={key}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionClick(key);
                    }}
                  >
                    {`${formatLabel(key)}: ${value}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Count (dynamic) */}
      {displayCount !== undefined && (
        <div className="mt-4 text-3xl font-bold text-gray-800">{displayCount}</div>
      )}
    </div>
  );
};

export default Card;
