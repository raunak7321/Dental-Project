const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getConfigurations,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration,
  getConfigurationById,
  getHeaderByAdminId
} = require("../Controllers/clinicConfigController");

router.post("/createUpload", createConfiguration);
router.get("/getUpload", getConfigurations);
// Get single configuration
router.get("/getUpload/:id", getConfigurationById);

// Update configuration
router.put("/updateUpload/:id", updateConfiguration);

// Delete configuration
router.delete("/deleteUpload/:id", deleteConfiguration);

router.get("/header/:adminId", getHeaderByAdminId);

module.exports = router;
