const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    image: {
        type: String,
    },
    doctorName: {
        type: String,
    },
    planAmount: {
        type: String,
    },
    planType: {
        type: String,
    },
    address: {
        type: String,
    },
    status: {
        type: String,
    },
}, { timestamps: true });

const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan;
