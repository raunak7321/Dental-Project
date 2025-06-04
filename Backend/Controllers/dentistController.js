const Dentist = require("../Models/dentistModel");
const User = require("../Models/userModel");

exports.createDentist = async (req, res) => {
  try {
    const { name, address, contact, email, password, opdAmount, timeSlots, branch, branchId } = req.body;
    if (!name || !email || !password || !branch) {
      return res.status(400).json({
        success: false,
        message: "Name, Email, Password, and Branch are required",
      });
    }

    const existing = await Dentist.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Dentist already exists with this email",
      });
    }

    const newDentist = new Dentist({
      name,
      address,
      contact,
      email,
      password,
      opdAmount,
      timeSlots,
      branch,
      branchId
    });

    await newDentist.save();

    res.status(201).json({
      success: true,
      message: "Dentist created successfully",
      dentist: newDentist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating dentist",
      error: error.message,
    });
  }
};

exports.getAllDentist = async (req, res) => {
  try {
    const dentists = await Dentist.find();

    res.status(200).json({
      success: true,
      dentists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dentists",
      error: error.message,
    });
  }
}

exports.getDentistsByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const dentists = await User.find({ branch: branchId });
    res.status(200).json({
      success: true,
      dentists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dentists by branch",
      error: error.message,
    });
  }
};

exports.getDentistById = async (req, res) => {
  try {
    const dentist = await Dentist.findById(req.params.id);

    if (!dentist) {
      return res.status(404).json({
        success: false,
        message: "Dentist not found",
      });
    }

    res.status(200).json({
      success: true,
      dentist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dentist",
      error: error.message,
    });
  }
}

exports.updateDentistById = async (req, res) => {
  try {
    const { name, address, contact, email, password } = req.body;

    const updatedDentist = await Dentist.findByIdAndUpdate(
      req.params.id,
      { name, address, contact, email, password },
      { new: true, runValidators: true }
    );

    if (!updatedDentist) {
      return res.status(404).json({
        success: false,
        message: "Dentist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dentist updated successfully",
      dentist: updatedDentist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating dentist",
      error: error.message,
    });
  }
}

exports.deleteDentistById = async (req, res) => {
  try {
    const deletedDentist = await Dentist.findByIdAndDelete(req.params.id);

    if (!deletedDentist) {
      return res.status(404).json({
        success: false,
        message: "Dentist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dentist deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting dentist",
      error: error.message,
    });
  }
}