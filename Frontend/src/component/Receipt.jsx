import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptRef = useRef();
  const patient = location.state?.patient;

  if (!patient) {
    return <p className="text-center mt-10">No patient data found.</p>;
  }

  // ✅ Handle Print
  const handlePrint = () => {
    const printContent = receiptRef.current;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @media print {
              body {
                margin: 0;
                font-family: sans-serif;
              }
              .receipt {
                width: 210mm;
                padding: 20mm;
                box-sizing: border-box;
              }
            }
            body {
              font-family: sans-serif;
              padding: 20px;
            }
            .receipt {
              border: 1px solid #ccc;
              padding: 20px;
              max-width: 800px;
              margin: auto;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // ✅ Handle PDF Download
  // const downloadReceipt = async () => {
  //   const canvas = await html2canvas(receiptRef.current, { scale: 2 });
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF("p", "mm", "a4");

  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   const pageHeight = pdf.internal.pageSize.getHeight();

  //   const imgProps = {
  //     width: pageWidth,
  //     height: (canvas.height * pageWidth) / canvas.width,
  //   };

  //   pdf.addImage(imgData, "PNG", 0, 0, imgProps.width, imgProps.height);
  //   pdf.save(`Receipt_${patient.appId || "App"}.pdf`);
  // };

  // ✅ Handle Save & Generate Receipt API
  const handleSaveReceipt = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/appointments/updateReceiptGenerate/${patient.appId}`,
        { receiptGenerate: true }
      );

      if (res.status === 200) {
        toast.success("Receipt saved successfully!");
        window.location.reload(); // reload the screen
      } else {
        toast.error("Failed to save receipt.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving receipt.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans text-sm bg-gray-50 min-h-screen">
      {/* Printable Section */}
      <div
        id="receipt-to-print"
        ref={receiptRef}
        className="bg-white p-8 border border-gray-300 shadow-lg text-gray-900"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Patient Receipt</h1>

        <div className="flex justify-between mb-4 border-b pb-2">
          <div>
            <p><strong>Date:</strong> {patient.date}</p>
            <p><strong>App ID:</strong> {patient.appId || "-"}</p>
            <p><strong>UHID:</strong> {patient.uhid}</p>
            <p><strong>Receipt Mode:</strong> {patient.receiptMode}</p>
          </div>
          <div>
            <p><strong>Patient Name:</strong> {patient.patientName}</p>
            <p><strong>Doctor:</strong> {patient.doctorName}</p>
            <p><strong>Transaction ID:</strong> {patient.transactionId || "---"}</p>
          </div>
        </div>

        <div className="mb-4">
          <p>
            Received with sincere thanks from <strong>{patient.patientName}</strong> the amount of 
            <strong> ₹{patient.amount}</strong> towards <strong>{patient.treatmentType || "Dental Services"}</strong>.
          </p>
          <p className="mt-2">
            Amount in Words: <strong>{patient.amountInWords} Rupee Only</strong>
          </p>
          <p className="mt-2">
            Mode of Payment: <strong>{patient.receiptMode}</strong>
          </p>
        </div>

        <p className="italic text-center my-8">
          “We appreciate your trust in our services and look forward to serving you again.”
        </p>

        <div className="flex justify-end">
          <div className="text-right">
            <p><strong>Authorized Signatory</strong></p>
            <p>{patient.receptionist || "Receptionist"}</p>
            <p>{patient.dateTime}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center mt-8 space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Back
        </button>
        {/* <button
          onClick={downloadReceipt}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Download Receipt
        </button> */}
        <button
          onClick={handlePrint}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Print Receipt
        </button>
        <button
          onClick={handleSaveReceipt}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Save Receipt
        </button>
      </div>
    </div>
  );
};

export default Receipt;
