const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: String },
  diagnosis: [String],
  tests: String,
  advice: String,
  prescriptionItems: [
    {
      name: String,
      dosage: String,
      timing: String
    }
  ],
  doctorName: [{ type: String }],
  patientName: { type: String },
  age: { type: String },
  gender: { type: String },
  date: { type: String },
  appDate: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);





