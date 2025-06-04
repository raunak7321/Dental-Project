const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/auth");
const { createExamination, updateExaminationById } = require("../Controllers/examinationController");

router.post("/createExamination", createExamination);
router.put("/updateExamination/:id", updateExaminationById);

module.exports = router;
