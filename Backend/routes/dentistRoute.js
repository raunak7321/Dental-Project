const express = require('express');
const router = express.Router();
const {
  createDentist,
  getAllDentist,
  getDentistById,
  updateDentistById,
  deleteDentistById,
  getDentistsByBranch
} = require('../Controllers/dentistController');

router.post('/createDentist', createDentist);
router.get('/getAllDentist', getAllDentist);

router.get("/branch/:branchId", getDentistsByBranch);
router.get('/getDentistById/:id', getDentistById);
router.patch('/updateDentistById/:id', updateDentistById);
router.delete('/deleteDentistById/:id', deleteDentistById);

module.exports = router;
