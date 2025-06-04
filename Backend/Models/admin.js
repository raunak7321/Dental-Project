const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
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
        unique: true,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    price: {
        type: String,
    },
    fee: {
        type: String,
    },
    role: {
        type: String,
    },
    status: {
        type: String,
    },
    otp: {
        type: String,
    },
    token: {
        type: String,
    },
    isVerified: {
        type: Boolean
    }
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
