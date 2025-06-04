const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  accountId: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "receptionist"]
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  otp: {
    type: String,
  },
  token: {
    type: String,
  },
  isVerified: {
    type: Boolean,
  },
  businessDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business"
  },
  address: {
    type: String,
  },
  opdAmount: {
    type: String,
  }, 
  timeSlots: [{ type: String }], 
  branchId: {
    type: String,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;


