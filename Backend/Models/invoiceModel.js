const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: true,
      unique: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    patientName: String,
    mobileNumber: String,
    address: String,
    doctorName: String,
    treatmentType: String,
    branchId: String,
    receptionist: String,
    createdAt: String,

    services: [
      {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Treatment" },
        description: String,
        rate: Number,
        quantity: Number,
        amount: Number,
      },
    ],

    discount: { type: Number, default: 0 },
    subtotal: Number,
    netPayable: Number,

  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
