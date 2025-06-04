const express = require("express");
const { dashboardDetails, dashboard } = require("../Controllers/dashboardController");
const router = express.Router();

router.get('/admin/dashboardDetails', dashboardDetails)
router.get('/receptionist/dashboardDetails',dashboard)

module.exports = router;
