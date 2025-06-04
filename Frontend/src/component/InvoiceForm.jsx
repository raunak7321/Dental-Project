import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import "react-toastify/dist/ReactToastify.css";

const InvoiceGenerator = () => {
  const selectedBranch = localStorage.getItem("selectedBranch");
  const receptionistName =
    localStorage.getItem("receptionistName") || "Receptionist";
  const invoiceRef = useRef();

  const token = localStorage.getItem("token");
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const adminId = decodedToken.id;
  const [headerUrl, setHeaderUrl] = useState([]);
  const [footerUrl, setFooterUrl] = useState([]);

  const [patients, setPatients] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [formData, setFormData] = useState({
    invoiceId: uuidv4().slice(0, 8).toUpperCase(),
    createdAt: new Date().toLocaleString(),
    uhid: "",
    appId: "",
    patientName: "",
    mobileNumber: "",
    address: "",
    doctorName: "",
    treatmentType: "",
    branchId: selectedBranch,
    receptionist: receptionistName,
    services: [],
    discount: 0,
    subtotal: 0,
    netPayable: 0,
  });

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
        return response.data; 
      } catch (error) {
        console.error("Error fetching header config:", error);
        throw error;
      }
    };

    getHeaderByAdminId(adminId);

    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/appointments/appointmentList`
        );
        const filtered = response.data.appointmentList.filter(
          (p) => p.isPatient && p.branchId === selectedBranch
        );
        setPatients(filtered);
      } catch (error) {
        console.error("Error fetching patients", error);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/services/getAllTreatment`
        );

        const formatted = res.data.treatments.map((t) => ({
          _id: t._id,
          name: `${t.treatmentName} (${t.procedureName})`,
          amount: parseFloat(t.price),
        }));
        setServicesList(formatted);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };

    fetchPatients();
    fetchServices();
  }, []);

  // When a patient is selected, fill in their details:
  useEffect(() => {
    if (!selectedPatientId) return;
    const p = patients.find((x) => x._id === selectedPatientId);
    if (!p) return;

    setFormData((f) => ({
      ...f,
      // Fixed: Access uhid and appId directly from the patient object instead of nested appointmentId
      uhid: p?.uhid || "Not Found",
      appId: p?.appId || "Not Found",
      patientName: p?.patientName || "Not Found",
      mobileNumber: p?.mobileNumber || "Not Found",
      address: p.address || "",
      doctorName: Array.isArray(p.doctorName)
        ? p.doctorName[0]
        : p.doctorName || "",
      treatmentType: p.treatmentType || "",
    }));
  }, [selectedPatientId, patients]);

  // Whenever services or discount change, recalc totals:
  useEffect(() => {
    const subtotal = formData.services.reduce((sum, s) => sum + s.amount, 0);
    const net = subtotal - formData.discount;
    setFormData((f) => ({
      ...f,
      subtotal,
      netPayable: net >= 0 ? net : 0,
    }));
  }, [formData.services, formData.discount]);

  const handleServiceChange = (i, field, val) => {
    const copy = [...formData.services];
    if (field === "serviceId") {
      const svc = servicesList.find((s) => s._id === val);
      copy[i] = {
        serviceId: svc._id,
        description: svc.name,
        rate: svc.amount,
        quantity: 1,
        amount: svc.amount,
      };
    } else if (field === "quantity") {
      const qty = parseInt(val, 10) || 0;
      copy[i].quantity = qty;
      copy[i].amount = copy[i].rate * qty;
    }
    setFormData((f) => ({ ...f, services: copy }));
  };

  const handleAddService = () =>
    setFormData((f) => ({
      ...f,
      services: [
        ...f.services,
        { serviceId: "", description: "", rate: 0, quantity: 1, amount: 0 },
      ],
    }));

  const handleRemoveService = (i) =>
    setFormData((f) => {
      const copy = [...f.services];
      copy.splice(i, 1);
      return { ...f, services: copy };
    });

  const handleDiscountChange = (e) => {
    const d = parseInt(e.target.value, 10) || 0;
    setFormData((f) => ({ ...f, discount: d }));
  };

  const handleSave = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/invoices/create`,
        formData
      );
      toast.success("Invoice saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save invoice");
    }
  };

  const handlePrint = () => {
    const html = invoiceRef.current.innerHTML;
    const win = window.open("", "_blank", "width=800,height=600");
    win.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <link
            href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
            rel="stylesheet"
          />
          <style>
            body { padding:2rem; color:#000; background:#fff; font-family:sans-serif;}
            table, th, td { border:1px solid #000; border-collapse:collapse;}
            th, td { padding:8px; text-align:left;}
             .print-header img, .print-footer img {
                width: 100%;
                height: 100px;
                object-fit: contain;
              }
          </style>
        </head>
        <body>
          ${html}
          <script>
            window.onload = () => {
              setTimeout(() => { window.print(); window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const patientOptions = patients.map((p) => ({
    value: p._id,
    label: `${p.patientName} (${p.uhid || "No UHID"})`,
  }));

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-teal-800">
        Generate Invoice
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Select Patient
        </label>
        <Select
          options={patientOptions}
          onChange={(o) => setSelectedPatientId(o?.value || "")}
          placeholder="Search or select patient..."
          isClearable
        />
      </div>

      <div ref={invoiceRef} className="p-6 border rounded text-black bg-white">
        {/* Header */}
        {headerUrl && (
          <div className="print-header mb-4">
            <img
              src={headerUrl}
              alt="Header"
              className="w-full h-[100px] object-contain"
            />
          </div>
        )}
        <div className="flex justify-between my-4">
          <div>
            <p>
              <b>Date:</b> {formData.createdAt}
            </p>
            <p>
              <b>Invoice No:</b> {formData.invoiceId}
            </p>
            <p>
              <b>Patient Name:</b> {formData.patientName}
            </p>
            {/* <p>
              <b>UHID:</b> {formData.uhid}
            </p> */}
          </div>
          <div>
            <p>
              <b>Doctor Name:</b> {formData.doctorName}
            </p>
            {/* <p>
              <b>Treatment Type:</b> {formData.treatmentType}
            </p> */}
            <p>
              <b>UHID:</b> {formData.uhid}
            </p>
          </div>
        </div>

        <h2 className="text-center text-red-600 text-xl font-bold my-4 underline">
          Invoice
        </h2>

        {/* Services */}
        <table className="w-full border text-sm mb-4">
          <thead>
            <tr className="border-b">
              <th className="p-2 border">S.no</th>
              <th className="p-2 border">Description of service</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Rate</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.services.map((s, i) => (
              <tr key={i}>
                <td className="p-2 border">{i + 1}</td>
                <td className="p-2 border">
                  <select
                    className="w-full px-2 py-1"
                    value={s.serviceId}
                    onChange={(e) =>
                      handleServiceChange(i, "serviceId", e.target.value)
                    }
                  >
                    <option value="">Select Service</option>
                    {servicesList.map((svc) => (
                      <option key={svc._id} value={svc._id}>
                        {svc.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    min="1"
                    className="w-full px-2 py-1"
                    value={s.quantity}
                    onChange={(e) =>
                      handleServiceChange(i, "quantity", e.target.value)
                    }
                  />
                </td>
                <td className="p-2 border">₹{s.rate}</td>
                <td className="p-2 border">₹{s.amount}</td>
                <td className="p-2 border text-center">
                  <button
                    className="text-red-500 font-bold"
                    onClick={() => handleRemoveService(i)}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={handleAddService}
          className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
        >
          + Add Service
        </button>

        {/* Totals */}
        <div className="text-right mt-4 space-y-1">
          <div className="flex justify-end items-center gap-2">
            <span className="font-semibold">Sub Total:</span>
            <span>₹{formData.subtotal}</span>
          </div>
          <div className="flex justify-end items-center gap-2">
            <span className="font-semibold">Discount:</span>
            <input
              type="number"
              className="border-b border-gray-400 w-24 text-right focus:outline-none"
              value={formData.discount}
              onChange={handleDiscountChange}
            />
          </div>
          <div className="flex justify-end items-center gap-2">
            <span className="font-semibold">Net Payable:</span>
            <span>₹{formData.netPayable}</span>
          </div>
        </div>

        <p className="text-center mt-10 font-semibold">
          "Thank you for choosing our services."
        </p>
      </div>

      <div className="flex gap-4 mt-6 justify-end">
        <button
          onClick={handleSave}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Save Invoice
        </button>
        <button
          onClick={handlePrint}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
