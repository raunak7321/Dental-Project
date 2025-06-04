// PrintableReceipt.jsx
import React from "react";
// import amountInWords from "../utils/amountInWords"; // update path accordingly
const amountInWords = (num) => {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const numToWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + numToWords(n % 100) : "");
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + numToWords(n % 1000) : "");
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + numToWords(n % 100000) : "");
    return numToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + numToWords(n % 10000000) : "");
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

const PrintableReceipt = ({ formData, headerUrl, footerUrl, receiptRef }) => {
  return (
    <div ref={receiptRef} className="w-full p-4 print:p-0">
      {/* Header */}
      {headerUrl && (
        <div className="print-header mb-4">
          <img
            src={headerUrl}
            alt="Header"
            className="w-full h-[100px] object-contain"
            style={{ maxHeight: "100px" }}
            onError={(e) => {
              e.target.style.display = "none";
              console.error("Failed to load header image");
            }}
          />
        </div>
      )}

      {/* Body */}
      <div className="receipt border border-gray-300 p-4 max-w-3xl mx-auto bg-white">
        <div className="flex justify-between mb-4">
          <div>
            <p>
              <b>Date:</b>{" "}
              {new Date(formData.createdAt).toLocaleDateString("en-GB")}
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
        <h2 className="text-center text-red-600 my-4">Receipt</h2>
        <p>
          Received with sincere thanks from <b>{formData.patientName}</b>{" "}
          towards the charges for <b>{formData.treatmentType}</b> a total amount
          of <b>₹{formData.paidAmount}</b>.
        </p>
        <p>
          Amount in words: <b>{amountInWords(formData.paidAmount)}</b>
        </p>
        <p>
          Mode of Payment: <b>{formData.paymentMode}</b>
        </p>
        <p className="text-center font-semibold mt-6">
          “We appreciate your trust in our services and look forward to serving
          you again.”
        </p>
        <div className="text-center mt-8">
          <p>
            <b>Authorized Signatory:</b>
          </p>
          <p>{formData.receptionist}</p>
          <p>{new Date(formData.createdAt).toLocaleDateString("en-GB")}</p>
        </div>
      </div>

      {/* Footer */}
      {footerUrl && (
        <div className="print-footer mt-4">
          <img
            src={footerUrl}
            alt="Footer"
            className="w-full h-[100px] object-contain"
            style={{ maxHeight: "100px" }}
            onError={(e) => {
              e.target.style.display = "none";
              console.error("Failed to load footer image");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PrintableReceipt;
