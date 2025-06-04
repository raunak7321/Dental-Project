import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const PatientTrends = ({ data = [] }) => {
  // Week filter options
  const weekOptions = [
    { value: "current", label: "Current Week" },
    { value: "last", label: "Last Week" },
    { value: "twoWeeksAgo", label: "Two Weeks Ago" },
    { value: "threeWeeksAgo", label: "Three Weeks Ago" },
  ];

  const [selectedWeek, setSelectedWeek] = useState("current");
  const [filteredData, setFilteredData] = useState([]);

  // Days of the week for our chart - include both standard and possible variations
  const dayMappings = {
    Mon: "Mond",
    Monday: "Mond",
    Mond: "Mon",
    Tues: "Tues",
    Tuesday: "Tues",
    Tue: "Tues",
    Wed: "Wed",
    Wednesday: "Wed",
    Wedn: "Wed",
    Thur: "Thur",
    Thursday: "Thur",
    Thu: "Thurs",
    Fri: "Fri",
    Friday: "Fri",
    Frid: "Fri",
    Sat: "Sat",
    Saturday: "Sat",
    Satu: "Sat",
    Sun: "Sun",
    Sunday: "Sund",
    Sund: "Sund",
  };

  const defaultDays = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sund"];


  useEffect(() => {
    if (!data || data.length === 0) {
      // If no data, set empty default structure
      setFilteredData(defaultDays.map((day) => ({ day, patients: 0 })));
      return;
    }

    // Since the API returns day names directly, we'll use that format
    // instead of trying to convert from dates
    const processedData = defaultDays.map((day) => {
      // Find matching day data by checking all possible variations
      const matchingData = data.find((item) => {
        const normalizedDay = dayMappings[item.day] || item.day;
        return normalizedDay === day;
      });

      return {
        day,
        patients: matchingData ? matchingData.count : 0,
      };
    });

    setFilteredData(processedData);
  }, [selectedWeek, data]);

  const handleWeekChange = (e) => {
    setSelectedWeek(e.target.value);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Weekly Patient Visits</h3>
        <div className="relative">
          <select
            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring focus:border-blue-300"
            value={selectedWeek}
            onChange={handleWeekChange}
          >
            {weekOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={filteredData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="patients" fill="#06b6d4" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PatientTrends;
