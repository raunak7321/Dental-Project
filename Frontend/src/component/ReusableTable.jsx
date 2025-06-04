import React, { useState, useRef, useEffect } from "react";
import { Eye, Edit, Trash2, CheckCircle, X } from "lucide-react";

const ReusableTable = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  onApprove,
  containerClassName = "",
  tableClassName = "",
  headerClassName = "",
  rowClassName = "",
  dropdownLabels = {
    view: "View",
    edit: "Edit",
    delete: "Delete",
    approve: "Approve",
  },
  customColumns = null,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef();

  const hasActions = Boolean(onView || onEdit || onDelete || onApprove);

  const dynamicKeys =
    data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== "_id" && key !== "__v")
      : [];

  const columns =
    customColumns ||
    dynamicKeys.map((key) => ({
      key,
      label:
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
    }));

 const toggleDropdown = (id, event) => {
   if (dropdownOpen === id) {
     setDropdownOpen(null);
   } else {
     const rect = event.currentTarget.getBoundingClientRect();
     const viewportHeight = window.innerHeight;
     const spaceBelow = viewportHeight - rect.bottom;
     const dropdownHeight = 150;

     let topPosition;
     if (spaceBelow < dropdownHeight) {
       topPosition = rect.top - dropdownHeight;
     } else {
       topPosition = rect.bottom + 5;
     }

     let leftPosition = rect.right - 190;
     if (leftPosition < 10) {
       leftPosition = 10;
     }

     setDropdownPosition({
       top: topPosition,
       left: leftPosition,
     });
     setDropdownOpen(id);
   }
  };
  
  const handleAction = (action, item) => {
    if (action === "view") onView?.(item);
    if (action === "edit") onEdit?.(item);
    if (action === "delete") onDelete?.(item);
    if (action === "approve") onApprove?.(item);
    setDropdownOpen(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`bg-white shadow-md rounded-lg border border-gray-200 ${containerClassName}`}
    >
      <div className="overflow-x-auto max-h-[70vh] w-full relative">
        <table
          className={`min-w-full table-auto border-collapse text-sm md:text-base ${tableClassName}`}
        >
          <thead className="bg-teal-900 text-white sticky top-0 z-20">
            <tr>
              <th className={`py-3 px-4 text-center ${headerClassName}`}>
                S/N
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3 px-4 text-left capitalize whitespace-nowrap ${headerClassName}`}
                >
                  {col.label}
                </th>
              ))}
              {hasActions && (
                <th
                  className={`py-3 px-4 text-center whitespace-nowrap ${headerClassName}`}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={row._id || index}
                  className={`even:bg-gray-50 hover:bg-teal-50 transition-colors ${rowClassName}`}
                >
                  <td className="py-2 px-4 text-center">{index + 1}</td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="py-2 px-4 text-left whitespace-nowrap"
                    >
                      {Array.isArray(row[col.key])
                        ? row[col.key].join(", ")
                        : row[col.key] || "N/A"}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={(e) => toggleDropdown(index, e)}
                        className="bg-teal-900 text-white px-3 py-1 rounded-md hover:bg-teal-600 text-sm"
                      >
                        Actions
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 2 : 1)}
                  className="py-4 text-center text-gray-500"
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {dropdownOpen !== null && (
          <div
            ref={dropdownRef}
            className="fixed z-50 bg-white shadow-lg rounded-md border w-48"
            style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
          >
            <div className="flex justify-between items-center border-b p-2">
              <span className="font-semibold">Actions</span>
              <button
                onClick={() => setDropdownOpen(null)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X size={16} />
              </button>
            </div>
            <ul className="text-left">
              {onView && (
                <li>
                  <button
                    onClick={() => handleAction("view", data[dropdownOpen])}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white flex items-center gap-2"
                  >
                    <Eye size={16} />
                    <span>{dropdownLabels.view || "View"}</span>
                  </button>
                </li>
              )}
              {onEdit && (
                <li>
                  <button
                    onClick={() => handleAction("edit", data[dropdownOpen])}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-yellow-500 hover:text-white flex items-center gap-2"
                  >
                    <Edit size={16} />
                    <span>{dropdownLabels.edit || "Edit"}</span>
                  </button>
                </li>
              )}
              {onDelete && (
                <li>
                  <button
                    onClick={() => handleAction("delete", data[dropdownOpen])}
                    className="w-full text-left px-4 py-2 text-white bg-red-500 hover:bg-red-600 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    <span>{dropdownLabels.delete || "Delete"}</span>
                  </button>
                </li>
              )}
              {onApprove && (
                <li>
                  <button
                    onClick={() => handleAction("approve", data[dropdownOpen])}
                    className="w-full text-left px-4 py-2 text-green-700 hover:bg-green-100 flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    <span>{dropdownLabels.approve || "Approve"}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReusableTable;
