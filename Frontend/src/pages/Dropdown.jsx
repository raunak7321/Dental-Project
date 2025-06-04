import React from 'react';

const Dropdown = ({ options, value, onChange, label, className }) => {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded text-sm max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
      >
        <option value="">Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
