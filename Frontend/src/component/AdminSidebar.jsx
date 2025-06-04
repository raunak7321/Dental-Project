import { MdArrowDropDown } from "react-icons/md";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";

const AdminSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  userRole,
  businessName,
  profilePhoto,
  licenseNumber,
  financialYear,
  contact,
  address,
}) => {
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    // Only toggle if user is admin
    if (userRole === "admin") {
      setIsOpen(!isOpen);
    }
  };

  // Define which sections are visible to which roles
  const roleSections = {
    admin: [
      "dashboard",
      "appointment",
      "patients",
      "services",
      "branches",
      "dentist",
      "staff",
      "billing",
      "report",
      "setting",
      "businessForm",
    ],
    receptionist: ["dashboard", "appointment", "patients", "billing"],
  };

  // Check if a section should be visible for the current role
  const isSectionVisible = (section) => {
    return roleSections[userRole]?.includes(section);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div>
        <button
          className="md:hidden p-3 text-white bg-teal-900 fixed top-2 left-2 z-50 rounded"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FaBars className="text-xl" />
        </button>

        {/* Overlay (Only for mobile) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 bg-[#2B7A6F] left-0 h-full text-white text-xl font-bold p-4 shadow-lg z-50 transition-transform duration-300 
          ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 w-64`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-gray-500">
          {
            <div>
              {profilePhoto ? (
                <img src={profilePhoto} className="rounded-full w-8 h-8" />
              ) : (
                <FaUserCircle className="text-3xl" />
              )}
            </div>
          }
          <div className="relative inline-block text-left">
            <button
              onClick={toggleDropdown}
              className={`flex items-center text-2xl font-semibold uppercase ${
                userRole === "admin" ? "cursor-pointer" : "cursor-default"
              }`}
            >
              {businessName}
              {userRole === "admin" && <MdArrowDropDown className="ml-1" />}
            </button>

            {isOpen && userRole === "admin" && (
              <div className="absolute mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <ul className="py-2 px-4 text-sm text-gray-700">
                  <li className="py-1 border-b">Address - {address}</li>
                  <li className="py-1 border-b">Contact - {contact}</li>
                  <li className="py-1 border-b">
                    License Number - {licenseNumber}
                  </li>
                  <li className="py-1">Financial Year - {financialYear}</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="mt-6">
          <div
            className="flex items-center justify-between p-2 cursor-pointer hover:bg-teal-700"
            onClick={() => navigate("dashboard")}
          >
            <span>Dashboard</span>
            {/* {openSection === "dashboard" ? (
              <MdKeyboardArrowDown />
            ) : (
              <MdKeyboardArrowRight />   
          )} */}
          </div>
          {/* Appointment */}
          {isSectionVisible("appointment") && (
            <>
              <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-teal-700"
                onClick={() => toggleSection("appointment")}
              >
                <span>Appointment</span>
                {openSection === "appointment" ? (
                  <MdKeyboardArrowDown />
                ) : (
                  <MdKeyboardArrowRight />
                )}
              </div>
              {openSection === "appointment" && (
                <div className="ml-4">
                  <Link
                    to={`/${userRole}/add-appointment`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Add Appointment
                  </Link>
                  <Link
                    to={`/${userRole}/appointment-list`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Appointment List
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Patients */}
          {isSectionVisible("patients") && (
            <>
              <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-teal-700"
                onClick={() => toggleSection("patients")}
              >
                <span>Patients</span>
                {openSection === "patients" ? (
                  <MdKeyboardArrowDown />
                ) : (
                  <MdKeyboardArrowRight />
                )}
              </div>
              {openSection === "patients" && (
                <div className="ml-4">
                  <Link
                    to={`/${userRole}/patient-list`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Patient List
                  </Link>
                  <Link
                    to={`/${userRole}/patient-history`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Patient History
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Services - Admin Only */}
          {isSectionVisible("services") && (
            <>
              <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-teal-700"
                onClick={() => toggleSection("services")}
              >
                <span>Services</span>
                {openSection === "services" ? (
                  <MdKeyboardArrowDown />
                ) : (
                  <MdKeyboardArrowRight />
                )}
              </div>
              {openSection === "services" && (
                <div className="ml-4">
                  <Link
                    to={`/${userRole}/add-services`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Add Services
                  </Link>
                  <Link
                    to={`/${userRole}/manage-services`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Manage Services
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Branches - Admin Only */}
          {isSectionVisible("branches") && (
            <>
              <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-teal-700"
                onClick={() => toggleSection("branches")}
              >
                <span>Branches</span>
                {openSection === "branches" ? (
                  <MdKeyboardArrowDown />
                ) : (
                  <MdKeyboardArrowRight />
                )}
              </div>
              {openSection === "branches" && (
                <div className="ml-4">
                  <Link
                    to={`/${userRole}/add-branches`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Add Branches
                  </Link>
                  <Link
                    to={`/${userRole}/manage-branches`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Manage Branches
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Dentist - Admin Only */}
          {isSectionVisible("dentist") && (
            <>
              <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-teal-700"
                onClick={() => toggleSection("dentist")}
              >
                <span>Dentist</span>
                {openSection === "dentist" ? (
                  <MdKeyboardArrowDown />
                ) : (
                  <MdKeyboardArrowRight />
                )}
              </div>
              {openSection === "dentist" && (
                <div className="ml-4">
                  <Link
                    to={`/${userRole}/add-dentist`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Add Dentist
                  </Link>
                  <Link
                    to={`/${userRole}/manage-dentist`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Manage Dentist
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Staff - Admin Only */}
          {isSectionVisible("staff") && (
            <>
              <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-teal-700"
                onClick={() => toggleSection("staff")}
              >
                <span>Staff</span>
                {openSection === "staff" ? (
                  <MdKeyboardArrowDown />
                ) : (
                  <MdKeyboardArrowRight />
                )}
              </div>
              {openSection === "staff" && (
                <div className="ml-4">
                  <Link
                    to={`/${userRole}/add-staff`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Add Staff
                  </Link>
                  <Link
                    to={`/${userRole}/manage-staff`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Manage Staff
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Billing */}
          {isSectionVisible("billing") && (
            <>
              <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-teal-700"
                onClick={() => toggleSection("billing")}
              >
                <span>Billing</span>
                {openSection === "billing" ? (
                  <MdKeyboardArrowDown />
                ) : (
                  <MdKeyboardArrowRight />
                )}
              </div>
              {openSection === "billing" && (
                <div className="ml-4">
                  <Link
                    to={`/${userRole}/reception-patient`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Receipt
                  </Link>
                  <Link
                    to={`/${userRole}/receipts`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Receipt List
                  </Link>
                  <Link
                    to={`/${userRole}/invoiceform`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Generate Invoice
                  </Link>

                  <Link
                    to={`/${userRole}/invoicelist`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Invoice List
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Report - Admin Only */}
          {isSectionVisible("report") && (
            <>
              <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-teal-700"
                onClick={() => toggleSection("report")}
              >
                <span>Report</span>
                {openSection === "report" ? (
                  <MdKeyboardArrowDown />
                ) : (
                  <MdKeyboardArrowRight />
                )}
              </div>
              {openSection === "report" && (
                <div className="ml-4">
                  <Link
                    to={`/${userRole}/revenue-report`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Revenue Report
                  </Link>
                  {/* <Link
                    to={`/${userRole}/revenue-report`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Patient Report
                  </Link> */}
                </div>
              )}
            </>
          )}

          {/* Setting - Admin Only */}
          {isSectionVisible("setting") && (
            <>
              <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-teal-700"
                onClick={() => toggleSection("setting")}
              >
                <span>Setting</span>
                {openSection === "setting" ? (
                  <MdKeyboardArrowDown />
                ) : (
                  <MdKeyboardArrowRight />
                )}
              </div>
              {openSection === "setting" && (
                <div className="ml-4">
                  <Link
                    to={`/${userRole}/setting`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    Clinic Configuration
                  </Link>
                  <Link
                    to={`/${userRole}/user-profile`}
                    className="block p-2 hover:bg-teal-700"
                  >
                    User profile
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
