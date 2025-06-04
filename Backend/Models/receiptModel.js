const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    receiptId: {
      type: String,
      required: true,
      unique: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Partially Paid"],
      required: true,
    },
    transactionId: String,
    paymentMode: {
      type: String,
      enum: ["Cash", "Card", "UPI"],
      required: true,
    },
    patientName: String,
    mobileNumber: String,
    address: String,
    doctorName: String,
    opdAmount: Number,
    treatmentType: String,
    branchId: String,
    receptionist: String,
    receiptDate: {
      type: Date,
      default: Date.now,
    },
    generateInvoice: {
      type: Boolean,
      default: false, 
    },
    printInovice: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Receipt", receiptSchema);
