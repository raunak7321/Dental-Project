const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
} = require("../Controllers/businessController");
const { auth, isAdmin } = require("../middlewares/auth");

// Multer Setup
// const storage = multer.diskStorage({});
// const upload = multer({ storage });

// Routes
router.post("/create-business", auth, createBusiness);
router.get("/getbusiness", getBusinesses);
router.get("/getbusinessBy/:id", getBusinessById);
router.put("/updatebusiness/:id", updateBusiness);
router.delete("/deletebusiness/:id", deleteBusiness);

module.exports = router;
