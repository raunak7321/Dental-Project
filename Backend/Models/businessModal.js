const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true, 
    },
    address: {
      type: String,
      required: true, 
    },
    contact: {
      type: String,
      required: true, 
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    financialYear: {
      type: String, 
    },
    businessPhoto: {
      url: {
        type: String,
        required: true, 
      },
      public_id: {
        type: String, 
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);

