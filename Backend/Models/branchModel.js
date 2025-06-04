const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    contact: {
        type: String,
    },
    pincode: {
        type: String,
    },
    branchId:{
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Branch', branchSchema);


