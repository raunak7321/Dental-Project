const mongoose = require("mongoose");

const ClinicConfigSchema = new mongoose.Schema({
  adminId:{
    type: String,
    default: null,
  },
  headerUrl: {
    type: String,
    default: null,
  },
  headerPublicId: {
    type: String,
    default: null,
  },
  footerUrl: {
    type: String,
    default: null,
  },
  footerPublicId: {
    type: String,
    default: null,
  },
  termsAndCondition: {
    type: String,
    default: "",
  },
  shareOnMail: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("ClinicConfig", ClinicConfigSchema);
