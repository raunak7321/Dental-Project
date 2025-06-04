const express = require("express");
const router = express.Router();

const { purchasePlan } = require("../Controllers/planController");

router.post("/purchasePlan", purchasePlan);

module.exports = router;