const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
});

module.exports = mongoose.model('Staff', staffSchema);
