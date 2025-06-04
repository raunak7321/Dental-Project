const express = require('express');
const router = express.Router();
const {
  createStaff,
  getAllStaff,
  getstaffById,
  updateStaffById,
  deleteStaffById
} = require('../Controllers/staffController');

router.post('/createstaff', createStaff);
router.get('/getAllStaff', getAllStaff);
router.get('/getstaffById/:id', getstaffById);
router.patch('/updatestaffById/:id', updateStaffById);
router.delete('/deletestaffById/:id', deleteStaffById);

module.exports = router;
