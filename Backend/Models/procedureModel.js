const mongoose = require("mongoose");

const procedureSchema = new mongoose.Schema({
  examinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Examination",
    required: [true, "Examination ID is required"]
  },
  procedureName: {
    type: String,
    required: [true, "Procedure name is required"],
    trim: true,
    minlength: [3, "Procedure name must be at least 3 characters long"]
  },
  treatmentName: {
    type: String,
    required: [true, "Treatment name is required"],
    trim: true,
    minlength: [3, "Treatment name must be at least 3 characters long"]
  },
  sittingRequired: {
    type: Number,
    required: [true, "Number of sittings is required"],
    min: [1, "At least 1 sitting is required"],
    max: [100, "Sitting count seems too high"]
  },
  cost: {
    type: Number,
    required: [true, "Cost is required"],
    min: [0, "Cost cannot be negative"]
  }
}, { timestamps: true });

module.exports = mongoose.model("Procedure", procedureSchema);


 