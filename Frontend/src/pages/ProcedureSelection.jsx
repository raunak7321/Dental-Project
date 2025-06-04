import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProcedureSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleClickPediatric = () => {
    localStorage.removeItem("treatmentIdReference");
    localStorage.removeItem("treatmentId");
    navigate(`/admin/procedure-pediatric/${id}`);
  };

  const handleClickAdult = () => {
    localStorage.removeItem("treatmentIdReference");
    localStorage.removeItem("treatmentId");
    navigate(`/admin/procedure-adult/${id}`);
  };
  return (
    <>
      <div className="pl-20 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-6 py-2 rounded shadow"
        >
          Back
        </button>
      </div>
      <div className="grid grid-cols-1 pl-20 md:grid-cols-2 gap-12 px-4">
        {/* Adult Dentistry Card */}
        <div
          onClick={() => handleClickAdult()}
          className="w-full h-48 bg-teal-100 hover:bg-teal-200 cursor-pointer rounded-xl shadow-md flex flex-col items-center justify-center text-center transition-all duration-200"
        >
          <h2 className="text-2xl font-semibold text-teal-900 mb-2">
            Adult Dentistry
          </h2>
          <p className="text-gray-700 px-4">
            Dental care and procedures for adults.
          </p>
        </div>

        {/* Pediatric Dentistry Card */}
        <div
          onClick={() => handleClickPediatric()}
          className="w-full h-48 bg-teal-100 hover:bg-teal-200 cursor-pointer rounded-xl shadow-md flex flex-col items-center justify-center text-center transition-all duration-200"
        >
          <h2 className="text-2xl font-semibold text-teal-900 mb-2">
            Pediatric Dentistry
          </h2>
          <p className="text-gray-700 px-4">
            Special dental care for children.
          </p>
        </div>
      </div>
    </>
  );
};

export default ProcedureSelection;
