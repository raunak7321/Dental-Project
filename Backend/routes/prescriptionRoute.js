const express = require("express");
const router = express.Router();

const { createPrescription, getPrescriptionByExamination } = require("../Controllers/prescriptionController");

router.post("/createPrescription", createPrescription);
router.get("/getPrescriptionByExaminationById/:examId", getPrescriptionByExamination);

module.exports = router;


