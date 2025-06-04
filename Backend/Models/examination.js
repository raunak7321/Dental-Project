const mongoose = require('mongoose');

const examinationSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  branchId: {
    type: String,
  },

});

module.exports = mongoose.model('examination', examinationSchema);
