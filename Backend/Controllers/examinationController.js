const Examination = require("../Models/examinationModel");
const Appointment = require("../Models/appointmentModels");
const mongoose = require("mongoose")

// Create Examination
exports.createExamination = async (req, res) => {
  try {
    const {
      appointmentId,
      type,
      treatments,
      chiefComplaint,
      examinationNotes,
      advice
    } = req.body;

    // Find appointment to fetch UHID
    const objectId = new mongoose.Types.ObjectId(appointmentId);
    const appointment = await Appointment.findById(objectId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found with this ID",
      });
    }

    const uhid = appointment.uhid;
    // Convert treatments to teethDetails
    const teethDetails = treatments.flatMap((treatment) => {
      const toothNames = treatment.toothName.split(',').map(name => name.trim());
      return toothNames.map(name => ({
        toothNumber: mapToothNameToNumber(name),
        dentalCondition: treatment.dentalCondition,
      }));
    });

    const newExamination = new Examination({
      appointmentId,
      uhid,
      type,
      teethDetails,
      chiefComplaint,
      examinationNotes,
      advice,
    });

    const saved = await newExamination.save();

    res.status(201).json({
      success: true,
      message: "Examination saved successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error saving examination:", error);
    res.status(500).json({
      success: false,
      message: "Error saving examination",
      error: error.message,
    });
  }
};

exports.updateExaminationById = async (req, res) => {
  try {
    const { examinationId } = req.params;
    const { treatments, chiefComplaint, examinationNotes, advice } = req.body;

    // Convert treatments to teethDetails
    const teethDetails = treatments.flatMap((treatment) => {
      const toothNames = treatment.toothName.split(',').map(name => name.trim());
      return toothNames.map(name => ({
        toothNumber: mapToothNameToNumber(name),
        dentalCondition: treatment.dentalCondition,
      }));
    });

    const updatedExamination = await Examination.findByIdAndUpdate(
      examinationId,
      {
        teethDetails,
        chiefComplaint,
        examinationNotes,
        advice,
      },
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
      data: updatedExamination,
    });
  } catch (error) {
    console.error("Error updating examination:", error);
    res.status(500).json({
      success: false,
      message: "Error updating examination",
      error: error.message,
    });
  }
}

function mapToothNameToNumber(toothName) {
  const toothMap = [
    "Upper Right Third Molar",
    "Upper Right Second Molar",
    "Upper Right First Molar",
    "Upper Right Second Premolar",
    "Upper Right First Premolar",
    "Upper Right Canine",
    "Upper Right Lateral Incisor",
    "Upper Right Central Incisor",
    "Upper Left Central Incisor",
    "Upper Left Lateral Incisor",
    "Upper Left Canine",
    "Upper Left First Premolar",
    "Upper Left Second Premolar",
    "Upper Left First Molar",
    "Upper Left Second Molar",
    "Upper Left Third Molar",
    "Lower Left Third Molar",
    "Lower Left Second Molar",
    "Lower Left First Molar",
    "Lower Left Second Premolar",
    "Lower Left First Premolar",
    "Lower Left Canine",
    "Lower Left Lateral Incisor",
    "Lower Left Central Incisor",
    "Lower Right Central Incisor",
    "Lower Right Lateral Incisor",
    "Lower Right Canine",
    "Lower Right First Premolar",
    "Lower Right Second Premolar",
    "Lower Right First Molar",
    "Lower Right Second Molar",
    "Lower Right Third Molar",
  ];

  return toothMap.indexOf(toothName) + 1;
}

