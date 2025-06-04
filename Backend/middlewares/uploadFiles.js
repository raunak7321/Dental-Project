const { upload } = require("../Config/cloudinary");

// Configure multer fields for multiple file uploads
const uploadFiles = upload.fields([
  { name: "header", maxCount: 1 },
  { name: "footer", maxCount: 1 },
]);

module.exports = uploadFiles;
