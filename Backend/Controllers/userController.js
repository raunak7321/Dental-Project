const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../Models/admin');
const nodemailer = require('nodemailer');

exports.userLogin = async (req, res) => {
  const { email, password, role } = req.body;

  const allowedRoles = ["admin", "receptionist"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      status: 400,
      message: "Validation error: Role must be either 'admin' or 'receptionist'."
    });
  }

  try {
    const user = await User.findOne({ email }).populate("businessDetails").exec();

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Authentication error: User not found."
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        status: 403,
        message: `Unauthorized access: Role mismatch. Registered as '${user.role}'.`
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 401,
        message: "Authentication error: Invalid credentials."
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

    return res.status(200).json({
      status: 200,
      message: "Login successful.",
      user,
      token,
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error while logging in."
    });
  }
};

exports.userRegister = async (req, res) => {
  const { firstName, lastName, password, address, email, role, phone, opdAmount, timeSlots, branchId } = req.body;

  // Role validation
  const allowedRoles = ["admin", "receptionist"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      status: 400,
      message: "Validation error: Role must be either 'admin' or 'receptionist'."
    });
  }

  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        status: 409,
        message: "Conflict: User with this email already exists."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      password: hashedPassword,
      address,
      email,
      role,
      phone,
      opdAmount, 
      timeSlots, 
      branchId
    });

    await newUser.save();

    return res.status(201).json({
      status: 201,
      message: "User registered successfully."
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({
      status: 500,
      message: "Internal server error while registering user."
    });
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtpEmail = async (email, otp) => {
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

  const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OTP Verification</title>
<style>
  body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f9fafb;
    color: #1f2937;
  }
  .container {
    max-width: 600px;
    margin: 20px auto;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 40px;
  }
  .header {
    text-align: center;
    margin-bottom: 32px;
  }
  .logo {
    max-width: 180px;
    height: auto;
  }
  h2 {
    color: #2563eb;
    font-size: 26px;
    margin-bottom: 20px;
    font-weight: bold;
    text-align: center;
  }
  .message {
    text-align: center;
    font-size: 16px;
    color: #374151;
    margin-bottom: 24px;
  }
  .otp-container {
    background: linear-gradient(135deg, #3b82f6, #1e40af);
    border-radius: 10px;
    padding: 25px;
    text-align: center;
    color: #ffffff;
    font-family: 'Courier New', monospace;
    box-shadow: 0 3px 10px rgba(30, 58, 138, 0.2);
    margin: 24px auto;
    width: fit-content;
  }
  .otp-code {
    font-size: 36px;
    font-weight: bold;
    letter-spacing: 2px;
    margin: 0;
  }
  .otp-expiry {
    font-size: 14px;
    color: #dbeafe;
    margin-top: 10px;
  }
  .warning {
    background-color: #fef2f2;
    border-left: 4px solid #dc2626;
    padding: 16px;
    border-radius: 8px;
    margin-top: 20px;
    font-size: 14px;
    color: #b91c1c;
  }
  .footer {
    text-align: center;
    color: #6b7280;
    font-size: 12px;
    margin-top: 30px;
    padding-top: 15px;
    border-top: 1px solid #e5e7eb;
  }
  @media (max-width: 640px) {
    .container {
      padding: 20px;
    }
    .otp-code {
      font-size: 28px;
    }
  }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <img src="/logos/full.png" alt="Your Logo" class="logo">
  </div>
  <h2>Verify Your Identity</h2>
  <p class="message">Use the OTP below to complete your verification. This code is valid for a limited time.</p>
  <div class="otp-container">
    <p class="otp-code">${otp}</p>
    <p class="otp-expiry">⏳ This code expires in 10 minutes</p>
  </div>
  <p class="message">If you did not request this OTP, please ignore this email or contact support.</p>
  <div class="warning">⚠️ Never share your OTP with anyone. We will never ask for it.</div>
  <div class="footer">
    <p>This is an automated message. Please do not reply.</p>
    <p>&copy; ${new Date().getFullYear()} Binary Funding. All rights reserved.</p>
  </div>
</div>
</body>
</html>`;
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Your Binary Funding Verification Code",
    html: htmlTemplate,
    text: `Your Binary Funding verification OTP is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this OTP, please ignore this email or contact our support team.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending OTP via email:", error.message || error);
    throw new Error("Unable to send OTP via email.");
  }
};

exports.signUpAdmin = async (req, res) => {
  const { firstName, lastName, email, phone, password, confirmPassword, role, status } = req.body;

  if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Admin already exists with this email." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Admin({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role,
      status,
      isVerified: false,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully.",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await Admin.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Admin does not exist with this email." });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    existingUser.otp = otp;
    existingUser.otpExpiresAt = otpExpiration;
    await existingUser.save();

    // Send OTP via Email
    await sendOtpEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to email. Please verify to continue.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, lastName: user.lastName, firstName: user.firstName, phone: user.phone }, "your_jwt_secret", { expiresIn: "1h" });
    res.status(200).json({ success: true, message: "OTP verified successfully.", token });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const user = await User.find({}).populate("businessDetails").exec();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the user.",
      error: error.message,
    });
  }
}

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the user.",
      error: error.message,
    });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, status } = req.body;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }
    const isStatusChanged = existingUser.status !== status;
    const updates = { firstName, lastName, email, phone, status };
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    if (isStatusChanged) {
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
        from: { name: "BINARY FUNDING", address: process.env.EMAIL_USERNAME },
        to: email,
        subject: "Account Status Update",
        html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Account Status Update</title>
                    <style>
                      body { font-family: 'Arial', sans-serif; background-color: #f9fafb; padding: 20px; }
                      .container { max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
                      .header { text-align: center; }
                      h2 { color: #2563eb; font-size: 26px; font-weight: bold; text-align: center; }
                      .message { font-size: 16px; color: #374151; margin-bottom: 20px; }
                      .status { font-size: 18px; font-weight: bold; color: ${status === "active" ? "#10b981" : "#ef4444"}; }
                      .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="header">
                        <h2>Account Status Updated</h2>
                      </div>
                      <p class="message">Hello ${firstName},</p>
                      <p class="message">Your account status has been updated to: <span class="status">${status.toUpperCase()}</span></p>
                      <p class="message">If you have any questions, please contact support.</p>
                      <div class="footer">
                        <p>This is an automated message. Please do not reply.</p>
                        <p>&copy; ${new Date().getFullYear()} Binary Funding. All rights reserved.</p>
                      </div>
                    </div>
                  </body>
                  </html>
              `,
      };
      await transporter.sendMail(mailOptions);
    }
    res.status(200).json({ message: "User updated successfully.", updatedUser });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the user.",
      error: error.message,
    });
  }
};

exports.deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "User Delete Successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the user.",
      error: error.message,
    });
  }
}

exports.getAdminById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Admin.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the user.",
      error: error.message,
    });
  }
};

exports.forgetPassword = async (req, res) => {
  const { email} = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email." });
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email. Please verify to reset your password.",
    });

  } catch (error) {
    console.error("Forget Password Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isVerifiedForReset = false;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful." });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate('businessDetails');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

