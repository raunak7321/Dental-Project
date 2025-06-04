const express = require("express");
const router = express.Router();

const { addProcedure, getProceduresByExamination } = require("../Controllers/procedureController");

router.post("/addprocedure", addProcedure);
router.get("/getProcedureByExaminationId/:examId", getProceduresByExamination);

module.exports = router;


