const ClinicConfig = require("../Models/clinicConficModel");
const cloudinary = require("cloudinary").v2;

// Get all clinic configurations
exports.getConfigurations = async (req, res) => {
  try {
    const configurations = await ClinicConfig.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      configurations,
    });
  } catch (error) {
    console.error("Error getting configurations:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching configurations",
    });
  }
};

// Create new clinic configuration
exports.createConfiguration = async (req, res) => {
  try {
    const { termsAndCondition, shareOnMail,adminId } = req.body;

    // Initialize header and footer as null
    let header = null;
    let footer = null;

    // Handle header image upload
    if (req.files && req.files.header) {
      const file = req.files.header;
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      header = { url: result.secure_url, public_id: result.headerPublic_id };
    }

    // Handle footer image upload
    if (req.files && req.files.footer) {
      const file = req.files.footer;
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      footer = { url: result.secure_url, public_id: result.footerPublic_id };
    }

    // Create new configuration instance
    const newConfig = new ClinicConfig({
      termsAndCondition: termsAndCondition || "",
      shareOnMail: shareOnMail === "true",
      headerUrl: header?.url || "",
      headerPublicId: header?.public_id || "",
      footerUrl: footer?.url || "",
      footerPublicId: footer?.public_id || "",
      adminId
    });

    // Save to database
    await newConfig.save();

    res.status(201).json({
      success: true,
      configuration: newConfig,
    });
  } catch (error) {
    console.error("Error creating configuration:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating configuration",
    });
  }
};

// Update existing clinic configuration
exports.updateConfiguration = async (req, res) => {
  try {
    const configId = req.params.id;
    const { termsAndCondition, shareOnMail } = req.body;

    // Find existing configuration
    const config = await ClinicConfig.findById(configId);
    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Configuration not found",
      });
    }

    // Update basic fields
    if (termsAndCondition !== undefined) {
      config.termsAndCondition = termsAndCondition;
    }

    if (shareOnMail !== undefined) {
      config.shareOnMail = shareOnMail === "true";
    }

    config.updatedAt = Date.now();

    // Handle header image update
    if (req.files && req.files.header) {
      // Delete old header image if exists
      if (config.headerPublicId) {
        await cloudinary.uploader.destroy(config.headerPublicId);
      }

      const file = req.files.header;
      const result = await cloudinary.uploader.upload(file.tempFilePath);

      config.headerUrl = result.secure_url;
      config.headerPublicId = result.public_id;
    }

    // Handle footer image update
    if (req.files && req.files.footer) {
      // Delete old footer image if exists
      if (config.footerPublicId) {
        await cloudinary.uploader.destroy(config.footerPublicId);
      }

      const file = req.files.footer;
      const result = await cloudinary.uploader.upload(file.tempFilePath);

      config.footerUrl = result.secure_url;
      config.footerPublicId = result.public_id;
    }

    // Save updated configuration
    await config.save();

    res.status(200).json({
      success: true,
      configuration: config,
    });
  } catch (error) {
    console.error("Error updating configuration:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating configuration",
    });
  }
};

// Delete clinic configuration
exports.deleteConfiguration = async (req, res) => {
  try {
    const configId = req.params.id;

    // Find configuration
    const config = await ClinicConfig.findById(configId);
    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Configuration not found",
      });
    }

    // Delete images from Cloudinary
    if (config.headerPublicId) {
      await cloudinary.uploader.destroy(config.headerPublicId);
    }

    if (config.footerPublicId) {
      await cloudinary.uploader.destroy(config.footerPublicId);
    }

    // Remove from database
    await config.deleteOne();

    res.status(200).json({
      success: true,
      message: "Configuration deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting configuration:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting configuration",
    });
  }
};

// Get single configuration by ID
exports.getConfigurationById = async (req, res) => {
  try {
    const configId = req.params.id;

    const config = await ClinicConfig.findById(configId);
    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Configuration not found",
      });
    }

    res.status(200).json({
      success: true,
      configuration: config,
    });
  } catch (error) {
    console.error("Error fetching configuration:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching configuration",
    });
  }
};

exports.getHeaderByAdminId = async (req, res) => {
  try {
    const { adminId } = req.params;
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }
    
    const config = await ClinicConfig.findOne({ adminId });

    if (!config) {
      return res.status(404).json({ message: "Clinic config not found" });
    }

    return res.status(200).json({
      headerUrl: config.headerUrl,
      footerUrl: config.footerUrl,
      headerPublicId: config.headerPublicId,
    });
  } catch (error) {
    console.error("Error fetching header config:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

