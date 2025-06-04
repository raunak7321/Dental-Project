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

// Procedure schema for procedureList
const procedureSchema = new mongoose.Schema({
  procedure: {
    type: String,
    required: true,
    trim: true
  },
  treatment: {
    type: String,
    trim: true
  },
  sitting: {
    type: String,
    trim: true
  },
  cost: {
    type: String,
    trim: true
  }
}, { _id: false });

// Medicine schema
const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  frequency: {
    type: String,
    trim: true
  },
  beforeFood: {
    type: String,
    trim: true
  },
  afterFood: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  instructions: {
    type: String,
    trim: true
  }
}, { _id: false });

// Materials Used schema
const materialsSchema = new mongoose.Schema({
  date: {
    type: Date
  },
  toothName: {
    type: String,
    trim: true
  },
  procedureDone: {
    type: String,
    trim: true
  },
  materialsUsed: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  nextDate: {
    type: Date
  }
}, { _id: false });

// Main Examination schema
const treatmentProcedureSchema = new mongoose.Schema({
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
  patientId: {
    type: String,
  },
  toothName: {
    type: String,
  },
  procedureDone: {
    type: String,
  },

  // Updated fields to store complex data
  procedureList: {
    type: [procedureSchema],
    default: []
  },
  medicines: {
    type: [medicineSchema],
    default: []
  },
  materialsUsed: {
    type: materialsSchema,
    default: {}
  },

  // Keep the original fields for backward compatibility
  procedures: [String],
  notes: String,
  date: {
    type: Date,
  },
  nextDate: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("TreatmentProcedure", treatmentProcedureSchema);