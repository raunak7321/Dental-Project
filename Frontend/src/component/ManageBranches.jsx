import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReusableTable from "./ReusableTable";

const ManageBranches = () => {
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const fetchBranches = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/branch/getAllBranch`
      );
      setBranches(res.data.branches);
      setFilteredBranches(res.data.branches);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Failed to fetch branches");
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    const filtered = branches.filter((branch) =>
      Object.values(branch).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredBranches(filtered);
  }, [searchTerm, branches]);

  const handleView = (branch) => {
    setSelectedBranch(branch);
    setShowModal(true);
  };

  const handleEdit = (branch) => {
    navigate(`/admin/edit-branch/${branch._id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_APP_BASE_URL}/branch/deleteBranchById/${id}`
        );
        toast.success("Branch deleted successfully");
        fetchBranches();
      } catch (error) {
        console.error("Error deleting branch:", error);
        toast.error("Failed to delete branch");
      }
    }
  };

  const customColumns = [
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "contact", label: "Contact" },
    { key: "pincode", label: "Pincode" },
  ];

  return (
    <div className="mx-auto px-2 md:px-4 py-4">
      <ToastContainer position="top-right" autoClose={5000} />

      {showModal && selectedBranch && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-11/12 md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Branch Details</h2>
            <p>
              <strong>Branch Id:</strong> {selectedBranch.branchId}
            </p>
            <p>
              <strong>Name:</strong> {selectedBranch.name}
            </p>
            <p>
              <strong>Address:</strong> {selectedBranch.address}
            </p>
            <p>
              <strong>Contact:</strong> {selectedBranch.contact}
            </p>
            <p>
              <strong>Pincode:</strong> {selectedBranch.pincode}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-700">
          Manage Branches
        </h2>
        <input
          type="text"
          placeholder="Search branches..."
          className="p-2 border rounded w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ReusableTable
        data={filteredBranches}
        dropdownLabels={{
          view: "View",
          edit: "Edit",
          delete: "Delete",
        }}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={(branch) => handleDelete(branch._id)}
        customColumns={customColumns}
        containerClassName="mt-2"
      />
    </div>
  );
};

export default ManageBranches;
  