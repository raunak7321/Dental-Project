const Staff = require('../Models/staffModel');

exports.createStaff = async (req, res) => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        staff,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
}
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json({
      status: 'success',
      results: staff.length,
      data: {
        staff,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
}
exports.getstaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({
        status: 'fail',
        message: 'No staff found with that ID',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        staff,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
}

exports.updateStaffById = async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // return the modified document
        runValidators: true, // validate before saving
      }
    );

    if (!updatedStaff) {
      return res.status(404).json({
        status: 'fail',
        message: 'No staff found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        staff: updatedStaff,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.deleteStaffById = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({
        status: 'fail',
        message: 'No staff found with that ID',
      });
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
} 
