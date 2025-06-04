import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Eye, Printer, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const invoiceRef = useRef();

  const token = localStorage.getItem("token");
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const adminId = decodedToken.id;
  const [headerUrl, setHeaderUrl] = useState([]);
  const [footerUrl, setFooterUrl] = useState([]);

  // 1. Fetch invoices
  useEffect(() => {
    const getHeaderByAdminId = async (adminId) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/clinic-config/header/${adminId}`
        );
        if (response) {
          setHeaderUrl(response.data.headerUrl);
          setFooterUrl(response.data.footerUrl);
        }
        return response.data; // { headerUrl, headerPublicId }
      } catch (error) {
        console.error("Error header config:", error);
        throw error;
      }
    };

    getHeaderByAdminId(adminId);

    const fetchInvoices = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/invoices/getAllInvoices`
        );
        setInvoices(data);
      } catch (err) {
        toast.error("Failed to fetch invoices");
        console.error(err);
      }
    };
    fetchInvoices();
  }, []);

  // 2. Filtered list
  const filteredInvoices = invoices.filter((inv) =>
    `${inv.patientName} ${inv && inv.appointmentId && inv.appointmentId.uhid} ${
      inv.invoiceId
    }`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // 3. Print helper
  const handlePrint = () => {
    if (!invoiceRef.current) return;
    const printContents = invoiceRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <link
            href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
            rel="stylesheet"
          />
          <style>
            body { padding: 2rem; color: #000; background: #fff; font-family: sans-serif; }
            table, th, td { border: 1px solid #000; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; }
            .header-image { width: 100%; height: auto; object-fit: contain; }
            .footer-image { width: 100%; height: auto; object-fit: contain; }
          </style>
        </head>
        <body>
          ${printContents}
          <script>
            window.onload = () => {
              // Fix image rendering in print view
              const headerImg = document.querySelector('.header-image');
              const footerImg = document.querySelector('.footer-image');
              if (headerImg) headerImg.style.maxHeight = '150px';
              if (footerImg) footerImg.style.maxHeight = '100px';
              
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
  };

  return (
    <div className="mx-auto px-4 py-6">
      <ToastContainer />
      <div className="mb-4 mt-2 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-700">Invoice List</h2>
        <input
          type="text"
          placeholder="Search by name, UHID or invoice"
          className="p-2 border rounded w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-teal-900 text-white sticky top-0 z-10 text-sm md:text-base">
            <tr>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Invoice No</th>
              <th className="py-2 px-4">Patient</th>
              <th className="py-2 px-4">Doctor</th>
              <th className="py-2 px-4">Treatment</th>
              <th className="py-2 px-4">UHID</th>
              <th className="py-2 px-4">Sub Total</th>
              <th className="py-2 px-4">Discount</th>
              <th className="py-2 px-4">Net Payable</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-500">
                  No matching invoices found.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr
                  key={inv._id}
                  className="border-b text-sm md:text-base text-gray-700 hover:bg-gray-50"
                >
                  <td className="py-2 px-4">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{inv.invoiceId}</td>
                  <td className="py-2 px-4">{inv.patientName}</td>
                  <td className="py-2 px-4">{inv.doctorName}</td>
                  <td className="py-2 px-4">{inv.treatmentType}</td>
                  <td className="py-2 px-4">
                    {(inv && inv.appointmentId && inv.appointmentId.uhid) ||
                      "not found"}
                  </td>
                  <td className="py-2 px-4">₹{inv.subtotal}</td>
                  <td className="py-2 px-4">₹{inv.discount}</td>
                  <td className="py-2 px-4 font-semibold text-teal-600">
                    ₹{inv.netPayable}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => setViewingInvoice(inv)}
                      className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      onClick={() => {
                        setViewingInvoice(inv);
                        // wait a tick to render modal content into ref
                        setTimeout(handlePrint, 100);
                      }}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                    >
                      <Printer size={16} /> Print
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white max-w-2xl w-full p-6 rounded shadow relative">
            <button
              onClick={() => setViewingInvoice(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <div ref={invoiceRef} className="text-black">
              {/* Header */}
              {headerUrl && (
                <div className="w-full text-center mb-4">
                  <img
                    src={headerUrl}
                    alt="Header"
                    className="header-image w-full h-auto max-h-36 object-contain"
                  />
                </div>
              )}
              <div className="flex justify-between mb-6">
                <div>
                  <p>
                    <b>Date:</b>{" "}
                    {new Date(viewingInvoice.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <b>Invoice No:</b> {viewingInvoice.invoiceId}
                  </p>
                  <p>
                    <b>Patient:</b> {viewingInvoice.patientName}
                  </p>
                  <p>
                    <b>UHID:</b>{" "}
                    {(viewingInvoice &&
                      viewingInvoice.appointmentId &&
                      viewingInvoice.appointmentId.uhid) ||
                      "Not Found"}
                  </p>
                </div>
                <div>
                  <p>
                    <b>Doctor:</b> {viewingInvoice.doctorName}
                  </p>
                  <p>
                    <b>Treatment:</b> {viewingInvoice.treatmentType}
                  </p>
                </div>
              </div>

              <h2 className="text-center text-red-600 text-xl font-bold mb-4">
                Invoice
              </h2>

              {/* Services Table */}
              <table className="w-full border mb-4 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">S.no</th>
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Rate</th>
                    <th className="p-2 border">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingInvoice.services.map((s, i) => (
                    <tr key={i}>
                      <td className="p-2 border">{i + 1}</td>
                      <td className="p-2 border">{s.description}</td>
                      <td className="p-2 border">{s.quantity}</td>
                      <td className="p-2 border">₹{s.rate}</td>
                      <td className="p-2 border">₹{s.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex flex-col items-end space-y-1 text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold">Sub Total:</span> ₹
                  {viewingInvoice.subtotal}
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">Discount:</span> ₹
                  {viewingInvoice.discount}
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">Net Payable:</span> ₹
                  {viewingInvoice.netPayable}
                </div>
              </div>

              <p className="text-center mt-6 font-semibold">
                "Thank you for choosing our services."
              </p>

              {footerUrl && (
                <div className="w-full text-center mt-4">
                  <img
                    src={footerUrl}
                    alt="Footer"
                    className="footer-image w-full h-auto max-h-24 object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
