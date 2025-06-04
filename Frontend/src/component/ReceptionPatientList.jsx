import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import html2pdf from "html2pdf.js";

const ReceiptGenerator = () => {
  const amountInWords = (num) => {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const numToWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100)
        return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
      if (n < 1000)
        return (
          a[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 !== 0 ? " and " + numToWords(n % 100) : "")
        );
      if (n < 100000)
        return (
          numToWords(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 !== 0 ? " " + numToWords(n % 1000) : "")
        );
      if (n < 10000000)
        return (
          numToWords(Math.floor(n / 100000)) +
          " Lakh" +
          (n % 100000 !== 0 ? " " + numToWords(n % 100000) : "")
        );
      return (
        numToWords(Math.floor(n / 10000000)) +
        " Crore" +
        (n % 10000000 !== 0 ? " " + numToWords(n % 10000000) : "")
      );
    };

    if (num === 0) return "Zero Rupees Only";

    const whole = Math.floor(num);
    const fraction = Math.round((num - whole) * 100);

    let words = numToWords(whole) + " Rupees";
    if (fraction > 0) {
      words += " and " + numToWords(fraction) + " Paise";
    }
    return words + " Only";
  };

  const selectedBranch = localStorage.getItem("selectedBranch");
  const receptionistName =
    localStorage.getItem("receptionistName") || "Receptionist";
  const receiptRef = useRef();

  const token = localStorage.getItem("token");
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const adminId = decodedToken.id;

  const [patients, setPatients] = useState([]);
  const [headerUrl, setHeaderUrl] = useState("");
  const [footerUrl, setFooterUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [formData, setFormData] = useState({
    appId: "",
    uhid: "",
    patientName: "",
    mobileNumber: "",
    address: "",
    doctorName: "",
    paymentMode: "",
    transactionId: "",
    receptionist: receptionistName,
    branchId: selectedBranch,
    totalAmount: "",
    paidAmount: "",
    paymentStatus: "",
    treatmentType: "",
    receiptId: uuidv4().slice(0, 8).toUpperCase(),
    createdAt: new Date().toLocaleString(),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch header and footer config
        const headerResponse = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/clinic-config/header/${adminId}`
        );

        if (headerResponse.data) {
          setHeaderUrl(headerResponse.data.headerUrl);
          setFooterUrl(headerResponse.data.footerUrl);
        }

        // Fetch patients
        const patientsResponse = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/appointments/appointmentList`
        );

        const filtered = patientsResponse.data.appointmentList.filter(
          (p) => p.isPatient && p.branchId === selectedBranch
        );

        setPatients(filtered);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [adminId, selectedBranch]);

  useEffect(() => {
    if (selectedPatientId) {
      const patient = patients.find((p) => p._id === selectedPatientId);
      if (patient) {
        setFormData((prev) => ({
          ...prev,
          appId: patient.appId,
          uhid: patient.uhid,
          patientName: patient.patientName,
          mobileNumber: patient.mobileNumber,
          address: patient.address,
          doctorName: patient.doctorName?.[0] || "",
          opdAmount: patient.opdAmount,
          paymentMode: patient.paymentMode || "",
          transactionId: patient.transactionId || "",
          treatmentType: patient.treatmentType || "",
          receptionist: patient.receptionist || receptionistName,
        }));
      }
    }
  }, [selectedPatientId, patients, receptionistName]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const element = receiptRef.current;
      const opt = {
        margin: 0.5,
        filename: `${formData.receiptId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      const blob = await html2pdf().from(element).set(opt).outputPdf("blob");
      const pdfBlob = new Blob([blob], { type: "application/pdf" });

      const uploadData = new FormData();
      uploadData.append("appId", formData.appId);
      uploadData.append("uhid", formData.uhid);
      uploadData.append("receiptId", formData.receiptId);
      uploadData.append("totalAmount", formData.totalAmount);
      uploadData.append("paidAmount", formData.paidAmount);
      uploadData.append("paymentMode", formData.paymentMode);
      uploadData.append("paymentStatus", formData.paymentStatus);
      uploadData.append("transactionId", formData.transactionId);
      uploadData.append("patientName", formData.patientName);
      uploadData.append("mobileNumber", formData.mobileNumber);
      uploadData.append("address", formData.address);
      uploadData.append("doctorName", formData.doctorName);
      uploadData.append("opdAmount", formData.opdAmount);
      uploadData.append("branchId", formData.branchId);
      uploadData.append("receptionist", formData.receptionist);
      uploadData.append("treatmentType", formData.treatmentType);

      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/receipts/create`,
        uploadData
      );

      toast.success("Receipt saved and uploaded successfully!");
    } catch (err) {
      console.error("Failed to save/upload receipt", err);
      toast.error("Something went wrong.");
    }
  };

  const handlePrint = () => {
    const printContent = receiptRef.current;
    const newWindow = window.open("", "_blank", "width=800,height=600");
    newWindow.document.write("<html><head><title>Receipt</title>");
    newWindow.document.write("<style>");
    newWindow.document.write(`
      body {
        font-family: sans-serif;
        padding: 20px;
        margin: 0;
      } 
      h2 {
        color: #c00;
      } 
      .header {
        text-align: center;
        font-size: 24px;
        margin-bottom: 10px;
      } 
      .line {
        border-top: 1px solid #aaa;
        margin: 10px 0;
      } 
      .bold {
        font-weight: bold;
      } 
      .footer {
        text-align: right;
        margin-top: 40px;
      }
      .print-header img, .print-footer img {
        width: 100% !important;
        max-height: 120px !important;
        object-fit: contain;
        margin: 0 auto;
        display: block;
      }
      .print-body {
        width: 100%;
        padding: 15px 0;
      }
      .no-break {
        page-break-inside: avoid;
      }
    `);
    newWindow.document.write("</style>");
    newWindow.document.write("</head><body>");
    newWindow.document.write(printContent.innerHTML);
    newWindow.document.write("</body></html>");
    newWindow.document.close();

    // Allow images to load before printing
    setTimeout(() => {
      newWindow.print();
    }, 1000);
  };

  const patientOptions = patients.map((p) => ({
    value: p._id,
    label: `${p.patientName} (${p.uhid})`,
  }));

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4 text-teal-800">
        Create Receipt
      </h2>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Select Patient
            </label>
            <Select
              options={patientOptions}
              onChange={(selected) =>
                setSelectedPatientId(selected?.value || "")
              }
              placeholder="Search or select patient..."
              isClearable
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              "appId",
              "uhid",
              "patientName",
              "mobileNumber",
              "address",
              "doctorName",
              "treatmentType",
              "totalAmount",
              "paidAmount",
            ].map((name) => (
              <div key={name}>
                <label className="block text-gray-700 mb-1">
                  {name
                    .replace(/([A-Z])/g, " $1")
                    .charAt(0)
                    .toUpperCase() + name.replace(/([A-Z])/g, " $1").slice(1)}
                </label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>
            ))}

            <div>
              <label className="block text-gray-700 mb-1">Payment Mode</label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select mode</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            {(formData.paymentMode === "Card" ||
              formData.paymentMode === "UPI") && (
              <div>
                <label className="block text-gray-700 mb-1">
                  Transaction ID
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-1">Payment Status</label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partially Paid">Partially Paid</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded"
              >
                Save Receipt
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Print Receipt
              </button>
            </div>
          </form>
        </>
      )}

      {/* Receipt Preview - Hidden on screen but used for printing */}
      <div ref={receiptRef} className="hidden">
        {/* Header */}
        {headerUrl && (
          <div className="print-header">
            <img
              src={headerUrl}
              alt="Header"
              style={{
                width: "100%",
                maxHeight: "120px",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
        )}

        <div className="print-body">
          <div className="line no-break" />

          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            className="no-break"
          >
            <div>
              <p>
                <b>Date:</b> {formData.createdAt}
              </p>
              <p>
                <b>Receipt No:</b> {formData.receiptId}
              </p>
              <p>
                <b>Patient Name:</b> {formData.patientName}
              </p>
              <p>
                <b>UHID:</b> {formData.uhid}
              </p>
            </div>
            <div>
              <p>
                <b>Doctor Name:</b> {formData.doctorName}
              </p>
              <p>
                <b>Treatment Type:</b> {formData.treatmentType}
              </p>
              <p>
                <b>Amount:</b> ₹{formData.paidAmount}
              </p>
              <p>
                <b>Mode:</b> {formData.paymentMode}
              </p>
              {formData.transactionId && (
                <p>
                  <b>Transaction Id:</b> {formData.transactionId}
                </p>
              )}
            </div>
          </div>

          <h2
            style={{ textAlign: "center", color: "red", margin: "20px 0" }}
            className="no-break"
          >
            Receipt
          </h2>

          <p className="no-break">
            Received with sincere thanks from <b>{formData.patientName}</b>{" "}
            towards the charges for <b>{formData.treatmentType}</b> a total
            amount of
            <b> ₹{formData.paidAmount}</b>.
          </p>
          <p className="no-break">
            Amount in words: <b>{amountInWords(formData.paidAmount || 0)}</b>
          </p>
          <p className="no-break">Mode of Payment: {formData.paymentMode}</p>

          <p
            style={{
              fontWeight: "bold",
              marginTop: "30px",
              textAlign: "center",
            }}
            className="no-break"
          >
            "We appreciate your trust in our services and look forward to
            serving you again."
          </p>

          <div className="footer text-center mt-6 no-break">
            <p>
              <b>Authorized Signatory:</b>
            </p>
            <p>{formData.receptionist}</p>
            <p>{formData.createdAt}</p>
          </div>
        </div>

        {/* Footer */}
        {footerUrl && (
          <div className="print-footer">
            <img
              src={footerUrl}
              alt="Footer"
              style={{
                width: "100%",
                maxHeight: "120px",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptGenerator;
