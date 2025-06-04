const mongoose = require("mongoose");

// Teeth details schema
const teethDetailsSchema = new mongoose.Schema({
  toothNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 32,
    validate: {
      validator: Number.isInteger,
      message: "Tooth number must be an integer"
    }
  },
  dentalCondition: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Main Examination schema
const examinationSchema = new mongoose.Schema({
  uhid: {
    type: String,
    required: [true, "UHID is required"],
    trim: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: [true, "Appointment ID is required"]
  },
  type: {
    type: String,
    enum: {
      values: ["Adult", "Pediatric"],
      message: "Type must be either 'Adult' or 'Pediatric'"
    },
    required: true
  },
  teethDetails: {
    type: [teethDetailsSchema],
    default: []
  },
  chiefComplaint: {
    type: String,
    trim: true
  },
  examinationNotes: {
    type: String,
    trim: true
  },
  advice: {
    type: String,
    trim: true
  },

}, { timestamps: true });

module.exports = mongoose.model("Examination", examinationSchema);
