import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching user data from API...");

    // Get current user role using the correct localStorage key
    const currentUserRole = localStorage.getItem("role");
    const currentUserEmail = localStorage.getItem("email");

    console.log("Current user role:", currentUserRole);

    axios
      .get(`${import.meta.env.VITE_APP_BASE_URL}/user/getAllUser`)
      .then((response) => {
        console.log("API response received:", response.data);

        // Extract the user array from the response
        const usersArray = response.data.user || [];

        // Filter users based on the current user's role
        let filteredData = [];

        if (currentUserRole === "admin") {
          // If admin is logged in, show only admin users
          filteredData = usersArray.filter((user) => user.role === "admin");
          console.log("Filtered admin data:", filteredData);
        } else if (currentUserRole === "receptionist") {
          // If receptionist is logged in, show only receptionist users
          filteredData = usersArray.filter(
            (user) => user.role === "receptionist"
          );
          console.log("Filtered receptionist data:", filteredData);
        } else {
          // Default case - show all users
          filteredData = usersArray;
        }

        setUserData(filteredData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setError("Failed to fetch user data");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!userData || userData.length === 0)
    return (
      <div className="text-center text-yellow-500">No user data available</div>
    );

  return (
    <div className="max-w-md mx-auto">
      {userData.map((user, index) => (
        <div
          key={user._id || index}
          className="bg-white rounded-2xl shadow-lg p-6 mb-4"
        >
          <div className="flex items-center space-x-4">
            <img
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
              src={user.image || "/api/placeholder/80/80"}
              alt="User Avatar"
            />
            <div>
              <h2 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600">{user.role}</p>
            </div>
          </div>

          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Email:</span>{" "}
              {user.email}
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">Phone:</span>{" "}
              {user.phone || "N/A"}
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">Status:</span>{" "}
              <span
                className={
                  user.status === "active" ? "text-green-600" : "text-red-600"
                }
              >
                {user.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
