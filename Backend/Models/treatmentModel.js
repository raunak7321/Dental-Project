const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
    procedureName: {
        type: String,
    },
    treatmentName: {
        type: String,
    },
    price: {
        type: String,
    },
    branchId: {
        type: String,
      },
});

module.exports = mongoose.model('Treatment', treatmentSchema);
