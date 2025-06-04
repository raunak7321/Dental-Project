const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

//auth
exports.auth = async (req, res, next) => {

  try {
    //extract token
    const token = req.body.token
      || req.header("Authorization").replace("Bearer ", "");
    //if token missing, then return response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing"
      })
    }

    //verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
      //verification issue
      return res.status(401).json({
        success: false,
        message: 'Token is invalid',
      });
    }
    next(); //when all done

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Something went wrong while validating the token',
    });
  }
}

//isStudent
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "receptionist" && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: 'This is a protected route for Admin only',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'User role cannot be verified, Please try again',
    });
  }
}

//isReceptionist
exports.isReceptionist = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "receptionist") {
      return res.status(403).json({ success: false, message: "Only receptionist access" });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Role check failed" });
  }
};



