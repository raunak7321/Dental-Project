import React, { useState, useEffect, useRef } from "react";
import { Eye, CheckCircle, X } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrintableReceipt from "./PrintableReceipt";

const ViewReceipt = () => {
  const [receipts, setReceipts] = useState([]);
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const receiptRef = useRef(null);

  const headerUrl = "https://yourdomain.com/header.png"; // Replace with actual URL
  const footerUrl = "https://yourdomain.com/footer.png"; // Replace with actual URL

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/receipts/getAllReceipts`
        );
        setReceipts(response.data);
      } catch (error) {
        console.error("Error fetching receipts:", error);
      }
    };
    fetchReceipts();
  }, []);

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
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

  const handleView = (receipt) => {
    setViewingReceipt(receipt);
  };

  const handlePrint = (receipt) => {
    setViewingReceipt(receipt);
  
    // Delay to ensure the modal and receipt are rendered
    const printContent = receiptRef.current;
    const newWindow = window.open("", "_blank", "width=800,height=600");
    newWindow.document.write("<html><head><title>Receipt</title>");
    newWindow.document.write("<style>body{font-family:sans-serif;padding:20px;} h2{color:#c00;} .header{text-align:center;font-size:24px;margin-bottom:10px;} .line{border-top:1px solid #aaa;margin:10px 0;} .bold{font-weight:bold;} .footer{text-align:right;margin-top:40px;}</style>");
    newWindow.document.write("</head><body>");
    newWindow.document.write(printContent.innerHTML);
    newWindow.document.write("</body></html>");
    newWindow.document.close();
    newWindow.print();
  };

  
  const handleGenerateInvoice = async (receipt) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_APP_BASE_URL}/receipts/updateReceiptById/${receipt._id}`,
        { generateInvoice: true }
      );
      if (res.status === 200) {
        toast.success("Invoice created successfully!");
        window.location.reload();
      } else {
        toast.error("Failed to generate invoice.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error generating invoice.");
    }
  };

  const handleCloseView = () => {
    setViewingReceipt(null);
  };

  const tableHeaders = [
    "Date", "Receipt No", "UHID", "Name", "Doctor Name",
    "Treatment", "Amount", "Mode", "Action",
  ];

  return (
    <div className="p-8">
      <ToastContainer />
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse table-fixed">
          <thead className="bg-teal-900 text-white sticky top-0 z-10">
            <tr className="text-sm md:text-base">
              {tableHeaders.map((header, idx) => (
                <th key={idx} className="py-2 px-4 text-left w-1/10">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {receipts.length > 0 ? (
              receipts.map((receipt, index) => (
                <tr key={receipt._id || index} className="border-b text-sm md:text-base text-gray-700 hover:bg-gray-100">
                  <td className="py-2 px-4">{new Date(receipt.appointmentId?.appointmentDate).toLocaleDateString("en-GB")}</td>
                  <td className="py-2 px-4">{receipt.receiptId}</td>
                  <td className="py-2 px-4">{receipt.appointmentId?.uhid}</td>
                  <td className="py-2 px-4">{receipt.patientName}</td>
                  <td className="py-2 px-4">{Array.isArray(receipt.doctorName) ? receipt.doctorName[0] : receipt.doctorName}</td>
                  <td className="py-2 px-4">{receipt.treatmentType}</td>
                  <td className="py-2 px-4">₹{receipt.opdAmount}</td>
                  <td className="py-2 px-4">{receipt.paymentMode}</td>
                  <td className="py-2 px-4 relative" ref={dropdownRef}>
                    <button
                      className="bg-teal-900 text-white px-3 py-1 rounded-md hover:bg-teal-600 flex items-center gap-1"
                      onClick={() => toggleDropdown(index)}
                    >
                      Actions
                    </button>
                    {dropdownOpen === index && (
                      <div className="absolute z-10 mt-2 w-40 bg-white shadow-lg rounded-md border right-0 top-0">
                        <div className="flex justify-between items-center border-b p-2">
                          <span className="font-semibold">Actions</span>
                          <button onClick={() => setDropdownOpen(null)} className="p-1 hover:bg-gray-200 rounded">
                            <X size={16} />
                          </button>
                        </div>
                        <ul className="text-left">
                          <li>
                            <button
                              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white flex items-center gap-2"
                              onClick={() => handleView(receipt)}
                            >
                              <Eye size={16} /><span>View</span>
                            </button>
                          </li>
                          <li>
                            <button
                              className="w-full text-left px-4 py-2 text-teal-600 hover:bg-teal-100 flex items-center gap-2"
                              onClick={() => handlePrint(receipt)}
                            >
                              <CheckCircle size={16} /><span>Print</span>
                            </button>
                          </li>
                          <li>
                            <button
                              className="w-full text-left px-4 py-2 text-teal-600 hover:bg-teal-100 flex items-center gap-2"
                              onClick={() => handleGenerateInvoice(receipt)}
                            >
                              <CheckCircle size={16} /><span>Generate Invoice</span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center text-gray-500 py-4">
                  No Receipts Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 overflow-auto max-h-[90vh] relative">
            <button
              onClick={handleCloseView}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
            >
              <X size={24} />
            </button>
            <div id="receipt-print-content">
              <PrintableReceipt
                formData={viewingReceipt}
                headerUrl={headerUrl}
                footerUrl={footerUrl}
                receiptRef={receiptRef}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReceipt;
