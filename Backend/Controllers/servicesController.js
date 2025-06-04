const Chief = require("../Models/chiefModel");
const Examination = require("../Models/examination");
const Medicine = require("../Models/medicineModel");
const Treatment = require("../Models/treatmentModel");

// Create Chief
exports.createChief = async (req, res) => {
  try {
    const { name, branchId } = req.body;

    const newChief = new Chief({ name, branchId });
    await newChief.save();

    res.status(201).json({
      success: true,
      message: "Chief created successfully",
      chief: newChief,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating chief",
      error: error.message,
    });
  }
};

// Get All Chiefs
exports.getAllChief = async (req, res) => {
  try {
    const chiefs = await Chief.find();

    res.status(200).json({
      success: true,
      chiefs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching chiefs",
      error: error.message,
    });
  }
};

// Get Chief by ID
exports.getChiefById = async (req, res) => {
  try {
    const chief = await Chief.findById(req.params.id);

    if (!chief) {
      return res.status(404).json({
        success: false,
        message: "Chief not found",
      });
    }

    res.status(200).json({
      success: true,
      chief,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching chief",
      error: error.message,
    });
  }
};

// Update Chief by ID
exports.updateChiefById = async (req, res) => {
  try {
    const { name } = req.body;

    const updatedChief = await Chief.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!updatedChief) {
      return res.status(404).json({
        success: false,
        message: "Chief not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chief updated successfully",
      chief: updatedChief,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating chief",
      error: error.message,
    });
  }
};

// Delete Chief by ID
exports.deleteChiefById = async (req, res) => {
  try {
    const deletedChief = await Chief.findByIdAndDelete(req.params.id);

    if (!deletedChief) {
      return res.status(404).json({
        success: false,
        message: "Chief not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chief deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting chief",
      error: error.message,
    });
  }
};

// Create Examination
exports.createExamination = async (req, res) => {
  try {
    const { name, branchId } = req.body;

    const newExamination = new Examination({ name, branchId });
    await newExamination.save();

    res.status(201).json({
      success: true,
      message: "Examination created successfully",
      examination: newExamination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating examination",
      error: error.message,
    });
  }
};

// Get All Examinations
exports.getAllExamination = async (req, res) => {
  try {
    const examinations = await Examination.find();

    res.status(200).json({
      success: true,
      examinations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching examinations",
      error: error.message,
    });
  }
};

// Get Examination by ID
exports.getExaminationById = async (req, res) => {
  try {
    const examination = await Examination.findById(req.params.id);

    if (!examination) {
      return res.status(404).json({
        success: false,
        message: "Examination not found",
      });
    }

    res.status(200).json({
      success: true,
      examination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching examination",
      error: error.message,
    });
  }
};

// Update Examination by ID
exports.updateExaminationById = async (req, res) => {
  try {
    const { name } = req.body;

    const updatedExamination = await Examination.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!updatedExamination) {
      return res.status(404).json({
        success: false,
        message: "Examination not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Examination updated successfully",
      examination: updatedExamination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating examination",
      error: error.message,
    });
  }
};

// Delete Examination by ID
exports.deleteExaminationById = async (req, res) => {
  try {
    const deletedExamination = await Examination.findByIdAndDelete(
      req.params.id
    );

    if (!deletedExamination) {
      return res.status(404).json({
        success: false,
        message: "Examination not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Examination deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting examination",
      error: error.message,
    });
  }
};

// Create Medicine
exports.createMedicine = async (req, res) => {
  try {
    const { name, branchId } = req.body;

    const newMedicine = new Medicine({ name, branchId });
    await newMedicine.save();

    res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      medicine: newMedicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating medicine",
      error: error.message,
    });
  }
};

// Get All Medicines
exports.getAllMedicine = async (req, res) => {
  try {
    const medicines = await Medicine.find();

    res.status(200).json({
      success: true,
      medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching medicines",
      error: error.message,
    });
  }
};

// Get Medicine by ID
exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      medicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching medicine",
      error: error.message,
    });
  }
};

// Update Medicine by ID
exports.updateMedicineById = async (req, res) => {
  try {
    const { name } = req.body;

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      medicine: updatedMedicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating medicine",
      error: error.message,
    });
  }
};

// Delete Medicine by ID
exports.deleteMedicineById = async (req, res) => {
  try {
    const deletedMedicine = await Medicine.findByIdAndDelete(req.params.id);

    if (!deletedMedicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting medicine",
      error: error.message,
    });
  }
};

// Create Treatment
exports.createTreatment = async (req, res) => {
  try {
    const { procedureName, treatmentName, price, branchId } = req.body;

    const newTreatment = new Treatment({
      procedureName,
      treatmentName,
      price,
      branchId,
    });

    await newTreatment.save();

    res.status(201).json({
      success: true,
      message: "Treatment created successfully",
      treatment: newTreatment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating treatment",
      error: error.message,
    });
  }
};

// Get All Treatments
exports.getAllTreatment = async (req, res) => {
  try {
    const treatments = await Treatment.find();

    res.status(200).json({
      success: true,
      treatments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching treatments",
      error: error.message,
    });
  }
};

// Get Treatment by ID
exports.getTreatmentById = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id);

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: "Treatment not found",
      });
    }

    res.status(200).json({
      success: true,
      treatment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching treatment",
      error: error.message,
    });
  }
};

// Update Treatment by ID
exports.updateTreatmentById = async (req, res) => {
  try {
    const { procedureName, treatmentName, price } = req.body;

    const updatedTreatment = await Treatment.findByIdAndUpdate(
      req.params.id,
      { procedureName, treatmentName, price },
      { new: true }
    );

    if (!updatedTreatment) {
      return res.status(404).json({
        success: false,
        message: "Treatment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Treatment updated successfully",
      treatment: updatedTreatment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating treatment",
      error: error.message,
    });
  }
};

// Delete Treatment by ID
exports.deleteTreatmentById = async (req, res) => {
  try {
    const deletedTreatment = await Treatment.findByIdAndDelete(req.params.id);

    if (!deletedTreatment) {
      return res.status(404).json({
        success: false,
        message: "Treatment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Treatment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting treatment",
      error: error.message,
    });
  }
};
