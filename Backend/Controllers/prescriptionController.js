const Prescription = require("../Models/prescriptionModel");

exports.createPrescription = async (req, res) => {
  try {
    const { appointmentId, diagnosis, tests, advice, prescriptionItems, doctorName,
      patientName,
      age,
      gender,
      date,
      appDate, } = req.body;

    const prescription = new Prescription({
      appointmentId,
      diagnosis,
      tests,
      advice,
      prescriptionItems,
      doctorName,
      patientName,
      age,
      gender,
      date,
      appDate,
    });

    await prescription.save();
    res.status(201).json({ message: 'Prescription saved successfully', prescription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPrescriptionByExamination = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findOne({ appointmentId: id });

    if (!prescription) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.status(200).json({ success: true, prescription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
