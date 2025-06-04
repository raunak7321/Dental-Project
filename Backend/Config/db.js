const mongoose = require("mongoose");
const User = require("../Models/userModel");
const bcrypt = require("bcrypt")
require("dotenv").config();

exports.connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connected Successfully")
    }
    catch (error) {
        console.log("DB connection failed");
        console.error(error);
        process.exit(1);
    }
};
