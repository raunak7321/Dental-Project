import React, { useEffect, useRef } from "react";
import { FaEye, FaCheckCircle } from "react-icons/fa";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

const ActionDropdown = ({
  isOpen,
  setIsOpen,
  item,
  onView,
  onEdit,
  onDelete,
  onApprove,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div className="relative inline-block text-left">
      <button
        className="bg-teal-900 text-white px-4 py-2 rounded-md shadow hover:bg-teal-700 transition"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        Actions
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg"
          style={{ minWidth: "11rem" }}
        >
          <div className="flex items-center justify-between border-b px-4 py-2 bg-gray-100">
            <span className="text-sm font-semibold text-gray-700">Actions</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-gray-200"
              aria-label="Close actions menu"
            >
              X
            </button>
          </div>

          <ul className="py-1 space-y-1">
            {onView && (
              <li>
                <button
                  onClick={() => {
                    onView(item);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-sm text-left"
                >
                  <FaEye className="text-teal-500" /> View
                </button>
              </li>
            )}
            {onEdit && (
              <li>
                <button
                  onClick={() => {
                    onEdit(item);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-teal-100 text-sm text-left"
                >
                  <AiFillEdit className="text-teal-500" /> Edit
                </button>
              </li>
            )}
            {onDelete && (
              <li>
                <button
                  onClick={() => {
                    onDelete(item._id);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-100 text-sm text-left"
                >
                  <AiFillDelete className="text-red-500" /> Delete
                </button>
              </li>
            )}
            {onApprove && (
              <li>
                <button
                  onClick={() => {
                    onApprove(item._id);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-teal-100 text-sm text-left"
                >
                  <FaCheckCircle className="text-teal-500" /> Approve
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;
