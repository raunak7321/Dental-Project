const express = require("express");
const router = express.Router();
const {
  uploadFiles,
  getFiles,
  getFileById,
  deleteFile,
} = require("../Controllers/fileController");

// Handle file uploads
router.post("/fileUpload", uploadFiles);

// Get all files
router.get("/getfileUpload", getFiles);

// Get a single file by ID
router.get("/getfileUploadBy:id", getFileById);

// Delete a file
router.delete("/deletefileUploadBy:id", deleteFile);

module.exports = router;
