/* eslint-disable no-unused-vars */
import { IoMdArrowDropdown } from "react-icons/io";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import BusinessForm from "./BusinessForm";
import axios from "axios";

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();
  const [businessName, setbusinessName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [contact, setcontact] = useState();
  const [licenseNumber, setlicenseNumber] = useState("");
  const [address, setaddress] = useState("");
  const [financialYear, setfinancialYear] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  // Check if user is admin
  const isAdmin = userRole === "admin";

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/branch/getAllBranch`
        );
        const branchList = res.data.branches;
        setBranches(branchList);

        // ✅ Match localStorage branchId with list and get _id
        const savedBranchId = localStorage.getItem("selectedBranch");
        if (savedBranchId) {
          const match = branchList.find(
            (branch) => branch.branchId === savedBranchId
          );
          if (match) {
            setSelectedBranch(match._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };

    fetchBranches();
  }, []);

  // Check if this is the first load after login
  useEffect(() => {
    // Check if user is admin and if this is their first visit to the dashboard
    const isFirstVisit = !localStorage.getItem("dashboardVisited");
    if (localStorage.getItem("user")) {
      const panel = JSON.parse(localStorage.getItem("user"));
      setbusinessName(panel.business.businessName);
      setProfilePhoto(panel.business.businessPhoto.url);
      setcontact(panel.business.contact);
      setaddress(panel.business.address);
      setfinancialYear(panel.business.financialYear);
      setlicenseNumber(panel.business.licenseNumber);
    } else {
      setbusinessName(userRole);
    }
    if (isAdmin && isFirstVisit) {
      // Set a small delay to ensure dashboard is loaded before showing popup
      const timer = setTimeout(() => {
        // Mark that the dashboard has been visited to avoid showing popup again
        localStorage.setItem("dashboardVisited", "true");
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [businessName, isAdmin]);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const user = JSON.parse(localStorage.getItem("user"));

    const details = userDetails?.businessDetails || user?.business;

    if (details) {
      // Only show business form for admin if details are missing
      setShowBusinessForm(isAdmin ? false : false);
      setbusinessName(details.businessName);
      setProfilePhoto(details.businessPhoto?.url);
      setcontact(details.contact);
      setaddress(details.address);
      setfinancialYear(details.financialYear);
      setlicenseNumber(details.licenseNumber);
    } else {
      // Only show form for admin users if data is missing
      setShowBusinessForm(isAdmin);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, [isAdmin]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("userDetails");
      localStorage.removeItem("role");
      // localStorage.removeItem("selectedBranch");

      sessionStorage.clear();
      navigate("/");
      window.location.reload();
    }
  };

  const handleOpenBusinessForm = () => {
    // Only admin can open business form
    if (isAdmin) {
      setShowBusinessForm(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userRole={userRole}
        businessName={businessName}
        profilePhoto={profilePhoto}
        address={address}
        licenseNumber={licenseNumber}
        financialYear={financialYear}
        contact={contact}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-58" : "ml-0"
        }`}
      >
        {/* Navbar */}
        <div className="bg-[#2B7A6F] text-white flex justify-between items-center px-6 py-4 fixed top-0 left-0 w-full z-10 shadow-md">
          {/* Sidebar toggle and current time (on smaller screens) */}
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                className="md:hidden p-2 bg-[#2B7A6F] rounded text-lg"
                onClick={() => setIsSidebarOpen(true)}
              >
                ☰
              </button>
            )}
            {/* Business name button - only visible for admin */}
            {isAdmin && (
              <button
                className="flex items-center gap-2 text-xl font-semibold bg-teal-700 hover:bg-teal-600 px-4 py-2 rounded transition"
                onClick={handleOpenBusinessForm}
              >
                <span>Business Name</span>
                <IoMdArrowDropdown />
              </button>
            )}

            <span className="text-sm md:hidden">{currentTime}</span>
          </div>

          {/* Right section: time, welcome, and logout */}
          <div className="flex items-center gap-4 text-right font-bold">
            <div className="w-64">
              <select
                value={selectedBranch}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSelectedBranch(selectedId);

                  // ✅ Find the full branch object
                  const selectedBranchObj = branches.find(
                    (branch) => branch._id === selectedId
                  );

                  if (selectedBranchObj) {
                    localStorage.setItem(
                      "selectedBranch",
                      selectedBranchObj.branchId
                    ); // ✅ Save branchId to localStorage
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#2B7A6F] focus:border-teal-500 text-white bg-[#2B7A6F]"
              >
                <option value="">Select a Branch</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.branchId}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm">{currentTime}</span>
              <span className="text-lg font-semibold">Welcome, {userRole}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-teal-700 transition p-2 rounded-md"
              title="Logout"
            >
              <FaUserCircle className="text-2xl" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 mt-[80px] overflow-y-auto">
          <Outlet />
        </div>
      </div>

      {/* Business Form Modal Popup - Only shown for admin */}
      {showBusinessForm && isAdmin && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/20 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full mx-4 animate-fade-in">
            <BusinessForm onClose={() => setShowBusinessForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
