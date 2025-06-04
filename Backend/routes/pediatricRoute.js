const express = require('express');
const router = express.Router();
const { createPediatricTreatment } = require("../Controllers/pediatricController");

router.post('/createPediatricTreatment', createPediatricTreatment);

module.exports = router;
