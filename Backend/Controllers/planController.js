const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require('../Models/userModel');
const Plan = require("../Models/planModels");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

const purchasePlan = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password, doctorName, planAmount, planType, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please login." });
    }

    // Generate a unique accountId
    const lastUser = await User.findOne().sort({ createdAt: -1 });
    let accountId = "DCA00000";
    if (lastUser && lastUser.accountId) {
      const lastAccountId = parseInt(lastUser.accountId.replace("DCA", ""), 10);
      const newAccountIdNumber = lastAccountId + 1;
      accountId = `DCA${String(newAccountIdNumber).padStart(5, "0")}`;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    const image = req.files.image;
    const uploadedImage = await uploadImageToCloudinary(
      image,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    if (!uploadedImage || !uploadedImage.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed.",
      });
    }

    // Save user with inactive status and referral info
    const newUser = new User({
      accountId,
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      image: uploadedImage.secure_url,
      doctorName,
      planAmount,
      planType,
      address,
      role: "admin",
      status: "inactive",
    });
    await newUser.save();

    // Save plan details
    const newPlan = new Plan({
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      image: uploadedImage.secure_url,
      doctorName,
      planAmount,
      planType,
      address,
      status: "pending",
    });
    await newPlan.save();

    // Send email with login credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: { name: "DENTAL CARE", address: process.env.EMAIL_USERNAME },
      to: email,
      subject: "Your Dental Care Account Credentials",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Credentials</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f1f5f9;
            margin: 0;
            padding: 0;
            color: #1e293b;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px 30px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          .logo {
            display: block;
            margin: 0 auto 20px;
            max-width: 180px;
          }
          h2 {
            text-align: center;
            color: #10b981;
            font-size: 28px;
            margin-bottom: 16px;
          }
          .message {
            text-align: center;
            font-size: 16px;
            margin-bottom: 24px;
            color: #334155;
          }
          .credentials {
            background-color: #d1fae5;
            border: 1px solid #10b981;
            border-radius: 10px;
            padding: 24px;
            color: #065f46;
            margin: 24px 0;
            text-align: center;
          }
          .credentials p {
            margin: 10px 0;
            font-size: 18px;
          }
          .credentials b {
            color: #047857;
          }
          .alert {
            background-color: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 16px;
            border-radius: 8px;
            font-size: 14px;
            color: #b91c1c;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            color: #94a3b8;
            font-size: 13px;
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="https://manasvitech.in/assets/manasvilogo-DYhVbJnJ.png" alt="Logo" class="logo">
          <h2>Welcome to Dental Care (OPC) Pvt.</h2>
          <p class="message">Dear ${firstName}, thank you for purchasing the plan.</p>
          
          <div class="credentials">
            <p><b>Email:</b> ${email}</p>
            <p><b>Password:</b> ${password}</p>
          </div>
          
          <p class="message">Your account is currently inactive. Please wait for admin approval.</p>
          <div class="alert">⚠️ Keep your credentials secure. Do not share them with anyone.</div>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Dental Care. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
      `,
    };
    

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Plan purchased successfully. Login credentials sent to your email." });
  } catch (error) {
    console.error("Error purchasing plan:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { purchasePlan };

