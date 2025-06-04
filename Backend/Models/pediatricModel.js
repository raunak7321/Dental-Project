const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: String,
    dosage: String,
    timing: String,
  },
  { _id: false }
);

const procedureSchema = new mongoose.Schema({
  procedure: String,
  cost: Number,
  remarks: String,
},
{ _id: true });

const pediatricTreatmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: false,
  },
  procedures: [procedureSchema],
  todayTreatment: String,
  prescribedMedicines: [medicineSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PediatricTreatment", pediatricTreatmentSchema);
