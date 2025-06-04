const File = require("../Models/fileModal");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.uploadFiles = async (req, res) => {
  try {
    const { note } = req.body;
    let uploadedFiles = req.files?.files; // Get the uploaded files

    // If no files are uploaded or files field doesn't exist
    if (!uploadedFiles || (Array.isArray(uploadedFiles) && uploadedFiles.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "No file(s) provided.",
      });
    }

    if (!Array.isArray(uploadedFiles)) {
      uploadedFiles = [uploadedFiles]; 
    }
    const uploadedFileData = [];
    for (let file of uploadedFiles) {
      const uploadedImage = await uploadImageToCloudinary(
        file,
        process.env.FOLDER_NAME,
        1000,
        1000
      );

      if (!uploadedImage || !uploadedImage.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed for one of the files.",
        });
      }

      // Create an object for the file to be saved in DB
      const fileData = {
        filename: file.originalname,
        fileUrl: uploadedImage.secure_url,
        fileType: uploadedImage.resource_type,
        cloudinaryId: uploadedImage.public_id,
        note,
      };

      uploadedFileData.push(fileData); // Add file data to the array
    }

    // Save all uploaded file data to DB
    await File.insertMany(uploadedFileData);

    return res.status(200).json({
      success: true,
      message: "Files uploaded successfully.",
      data: uploadedFileData, // You can return the file data if needed
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to upload files",
    });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
};

exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    res.json(file);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch file" });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete from Cloudinary
    const publicId = file.cloudinaryId;
    await cloudinary.uploader.destroy(publicId);

    // Delete from database
    await File.findByIdAndDelete(req.params.id);

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
};
