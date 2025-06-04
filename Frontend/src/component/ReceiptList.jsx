import React, { useState, useEffect, useRef } from "react";
import { Eye, Printer, X } from "lucide-react";
import axios from "axios";
import PrintableReceipt from "./PrintableReceipt";
import { toast } from "react-toastify";

const ReceiptList = () => {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState([]);
  const receiptRef = useRef(null);

  const token = localStorage.getItem("token");
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const adminId = decodedToken.id;
  const [headerUrl, setHeaderUrl] = useState([]);
  const [footerUrl, setFooterUrl] = useState([]);

  useEffect(() => {
    const getHeaderByAdminId = async (adminId) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/clinic-config/header/${adminId}`);
        if (response) {
          setHeaderUrl(response.data.headerUrl)
          setFooterUrl(response.data.footerUrl)
        }
        return response.data; 
      } catch (error) {
        console.error("Error fetching header config:", error);
        throw error;
      }
    };
    getHeaderByAdminId(adminId)
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/appointments/appointmentList`
        );
        const filtered = response.data.appointmentList.filter(
          (appointment) => appointment.InvoiceGenerate
        );
        setInvoices(filtered);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/receipts/getAllReceipts`);
        setReceipts(res.data);
      } catch (err) {
        toast.error("Error fetching receipts");
      }
    };
    fetchReceipts();
  }, []);

  const handleView = (receipt) => {
    setSelectedReceipt(receipt);
  };

  const handleCloseView = () => {
    setSelectedReceipt(null);
  };

  const handlePrint = () => {
    if (receiptRef.current) {
      const printContents = receiptRef.current.innerHTML;
      const printWindow = window.open("", "_blank", "width=800,height=600");
  
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
            <style>
              body { padding: 2rem; color: #000; background: #fff; font-family: sans-serif; }
              .print-header img, .print-footer img {
                width: 100%;
                height: 100px;
                object-fit: contain;
              }
              .receipt {
                border: 1px solid #d1d5db;
                padding: 1rem;
                max-width: 768px;
                margin: 0 auto;
                background: #fff;
              }
              .text-center { text-align: center; }
              .font-semibold { font-weight: 600; }
              p { margin: 4px 0; }
            </style>
          </head>
          <body>
            ${printContents}
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };  

  // Filter receipts based on search term
  const filteredReceipts = receipts.filter((receipt) =>
    `${receipt.patientName} ${receipt.receiptId} ${receipt.appointmentId?.uhid || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Receipt List</h2>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by patient name, receipt ID, or UHID"
          className="p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="w-full overflow-auto">
        <table className="w-full table-auto border-collapse bg-white shadow-md rounded-md">
          <thead className="bg-teal-900 text-white">
            <tr>
              <th className="p-2 text-left whitespace-nowrap">Date</th>
              <th className="p-2 text-left whitespace-nowrap">Receipt No</th>
              <th className="p-2 text-left whitespace-nowrap">UHID</th>
              <th className="p-2 text-left whitespace-nowrap">Patient</th>
              <th className="p-2 text-left whitespace-nowrap">Doctor</th>
              <th className="p-2 text-left whitespace-nowrap">Treatment</th>
              <th className="p-2 text-left whitespace-nowrap">Amount</th>
              <th className="p-2 text-left whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReceipts.length > 0 ? (
              filteredReceipts.map((receipt) => (
                <tr key={receipt._id} className="border-b text-sm text-gray-700">
                  <td className="p-2 whitespace-nowrap">
                    {new Date(receipt.appointmentId?.appointmentDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 whitespace-nowrap">{receipt.receiptId}</td>
                  <td className="p-2 whitespace-nowrap">{receipt.appointmentId?.uhid}</td>
                  <td className="p-2 whitespace-nowrap">{receipt.patientName}</td>
                  <td className="p-2 whitespace-nowrap">
                    {Array.isArray(receipt.doctorName) ? receipt.doctorName[0] : receipt.doctorName}
                  </td>
                  <td className="p-2 whitespace-nowrap">{receipt.treatmentType}</td>
                  <td className="p-2 whitespace-nowrap">₹{receipt.opdAmount}</td>
                  <td className="p-2 whitespace-nowrap">
                    <button
                      onClick={() => handleView(receipt)}
                      className="bg-teal-700 text-white px-3 py-1 rounded hover:bg-teal-600 flex items-center gap-1"
                    >
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 p-4">
                  No receipts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Viewing Receipt */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full relative overflow-auto max-h-[90vh]">
            <button onClick={handleCloseView} className="absolute top-2 right-2 text-gray-600 hover:text-red-600">
              <X size={24} />
            </button>
            <div ref={receiptRef}>
              <PrintableReceipt
                formData={selectedReceipt}
                headerUrl={headerUrl}
                footerUrl={footerUrl}
                receiptRef={receiptRef}
              />
            </div>
            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 flex items-center gap-1"
            >
              <Printer size={16} /> Print Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptList;




