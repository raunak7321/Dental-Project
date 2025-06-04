import { useState, useRef, useEffect } from "react";
import { cards, insuranceData, userData } from "./SettingData";
import SettingsCard from "./SettingsCard";
import InsuranceTable from "./InsuranceTable";
import ClinicTable from "./ClinicTable";
import UserTable from "./UserTable";
import BusinessForm from "./ManageBusinessForm";
import ActionsDropdown from "./ActionDropdown";

const Setting = () => {
  const [openForm, setOpenForm] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCardClick = (id) => {
    setOpenForm(id);
  };

  const closeForm = () => {
    setOpenForm(null);
  };

  const toggleDropdown = (id, event) => {
    if (dropdownOpen === id) {
      setDropdownOpen(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 5,
        left: rect.right - 190,
      });
      setDropdownOpen(id);
    }
  };

  const handleView = (id) => {
    console.log("View item:", id);
    setDropdownOpen(null);
  };

  const handleEdit = (id) => {
    console.log("Edit item:", id);
    setDropdownOpen(null);
  };

  const handleDelete = (id) => {
    console.log("Delete item:", id);
    setDropdownOpen(null);
  };

  const renderForm = (id) => {
    switch (id) {
      case "insurance":
        return (
          <InsuranceTable
            insuranceData={insuranceData}
            onClose={closeForm}
            toggleDropdown={toggleDropdown}
          />
        );
      case "clinic":
        return <ClinicTable onClose={closeForm} />;
      case "user":
        return (
          <UserTable
            userData={userData}
            onClose={closeForm}
            toggleDropdown={toggleDropdown}
          />
        );
      case "business":
        return <BusinessForm onClose={closeForm} />;
      case "busines":
        return (
          <UserTable
            userData={userData}
            onClose={closeForm}
            toggleDropdown={toggleDropdown}
          />
        );
       
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Setting</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <SettingsCard key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>

      {openForm && renderForm(openForm)}

      {dropdownOpen && (
        <ActionsDropdown
          dropdownRef={dropdownRef}
          position={dropdownPosition}
          dropdownId={dropdownOpen}
          onClose={() => setDropdownOpen(null)}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Setting;
