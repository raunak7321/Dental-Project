const express = require("express");
const {
  createBranch,
  getAllBranch,
  getBranchById,
  updateBranchById,
  deleteBranchById,
} = require("../Controllers/branchController");
const router = express.Router();
const { isAdmin, auth } = require("../middlewares/auth");

router.post("/createBranch", auth, isAdmin, createBranch);
router.get("/getAllBranch", getAllBranch);
router.get("/getBranchById/:id", getBranchById);
router.patch("/updateBranchById/:id", updateBranchById);
router.delete("/deleteBranchById/:id", deleteBranchById);

module.exports = router;
