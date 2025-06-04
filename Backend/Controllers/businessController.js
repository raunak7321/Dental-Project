const Business = require("../Models/businessModal");
const User = require("../Models/userModel");
const cloudinary = require("cloudinary").v2

// Create
exports.createBusiness = async (req, res) => {
  try {
    let photo = null;
    if (req.files && req.files.businessPhoto) {
      const file = req.files.businessPhoto
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      photo = { url: result.secure_url, public_id: result.public_id };
    }
    const business = new Business({ ...req.body, businessPhoto: photo });
    await business.save();
    
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } 

    user.businessDetails = business._id;
    await user.save();
 
    res.status(201).json({
      success:true,
      business});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All
exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get One
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ error: "Not found" });

    if (req.files.businessPhoto) {
      if (business.businessPhoto?.public_id) {
        await cloudinary.uploader.destroy(business.businessPhoto.public_id);
      }
      const file = req.files.businessPhoto
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      req.body.businessPhoto = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }
    const updated = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ error: "Not found" });

    if (business.businessPhoto?.public_id) {
      await cloudinary.uploader.destroy(business.businessPhoto.public_id);
    }

    await Business.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
