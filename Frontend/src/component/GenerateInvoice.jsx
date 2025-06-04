import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Eye, X } from "lucide-react";
import InvoiceForm from "./InvoiceForm";

const GenerateInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);

  
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
        return response.data; // { headerUrl, headerPublicId }
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

  const handleGenerateInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const tableHeaders = [
    "Date", "Invoice No", "UHID", "Name", "Doctor Name",
    "Treatment", "Amount", "Mode", "Action"
  ];

  return (
    <div className="p-8">
            {/* <div className="header-image-container">
        {headerUrl && headerUrl.length > 0 && (
          <img src={headerUrl} alt="Header" className="w-full h-22 " />
        )}
      </div> */}

      {!selectedInvoice ? (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <div className="relative">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full border-collapse table-fixed">
                <thead className="bg-teal-900 text-white sticky top-0 z-10">
                  <tr className="text-sm md:text-base">
                    {tableHeaders.map((header) => (
                      <th key={header} className="py-2 px-4 text-left">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.length > 0 ? (
                    invoices.map((invoice, index) => (
                      <tr key={invoice.id} className="border-b hover:bg-gray-100 text-sm md:text-base">
                        <td className="py-2 px-4">{invoice.appointmentDate}</td>
                        <td className="py-2 px-4">{invoice.receiptNo}</td>
                        <td className="py-2 px-4">{invoice.uhid}</td>
                        <td className="py-2 px-4">{invoice.patientName}</td>
                        <td className="py-2 px-4">{Array.isArray(invoice.doctorName) ? invoice.doctorName[0] : invoice.doctorName}</td>
                        <td className="py-2 px-4">{invoice.treatment}</td>
                        <td className="py-2 px-4">₹{invoice.opdAmount}</td>
                        <td className="py-2 px-4">{invoice.paymentMode}</td>
                        <td className="py-2 px-4 relative" ref={dropdownRef}>
                          <button
                            className="bg-teal-900 text-white px-3 py-1 rounded-md hover:bg-teal-600"
                            onClick={() => toggleDropdown(index)}
                          >
                            Actions
                          </button>
                          {dropdownOpen === index && (
                            <div className="absolute z-10 mt-2 w-40 bg-white shadow-lg rounded-md border right-0 top-0">
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
                                <li>
                                  <button
                                    className="w-full text-left px-4 py-2 text-teal-700 hover:bg-teal-100 flex items-center gap-2"
                                    onClick={() => handleGenerateInvoice(invoice)}
                                  >
                                    <Eye size={16} /><span>Invoice</span>
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
                        No Inovice Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <InvoiceForm data={selectedInvoice} onBack={() => setSelectedInvoice(null)} />
      )}
    </div>
  );
};

export default GenerateInvoice;
