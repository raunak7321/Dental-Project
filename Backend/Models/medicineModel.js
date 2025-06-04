const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  branchId: {
    type: String,
  },
});

module.exports = mongoose.model('Medicine', medicineSchema);
