const express = require('express');
const router = express.Router();
const {
    createChief,
    getAllChief,
    getChiefById,
    updateChiefById,
    deleteChiefById,

    createExamination,
    getAllExamination,
    getExaminationById,
    updateExaminationById,
    deleteExaminationById,

    createTreatment,
    getAllTreatment,
    getTreatmentById,
    updateTreatmentById,
    deleteTreatmentById,

    createMedicine,
    getAllMedicine,
    getMedicineById,
    updateMedicineById,
    deleteMedicineById,

} = require('../Controllers/servicesController');

router.post('/createChief', createChief);
router.get('/getAllChief', getAllChief);
router.get('/getChiefById/:id', getChiefById);
router.patch('/updateChiefById/:id', updateChiefById);
router.delete('/deleteChiefById/:id', deleteChiefById);

router.post('/createExamination', createExamination);
router.get('/getAllExamination', getAllExamination);
router.get('/getExaminationById/:id', getExaminationById);
router.patch('/updateExaminationById/:id', updateExaminationById);
router.delete('/deleteExaminationById/:id', deleteExaminationById);

router.post('/createTreatment', createTreatment);
router.get('/getAllTreatment', getAllTreatment);
router.get('/getTreatmentById/:id', getTreatmentById);
router.patch('/updateTreatmentById/:id', updateTreatmentById);
router.delete('/deleteTreatmentById/:id', deleteTreatmentById);

router.post('/createMedicine', createMedicine);
router.get('/getAllMedicine', getAllMedicine);
router.get('/getMedicineById/:id', getMedicineById);
router.patch('/updateMedicineById/:id', updateMedicineById);
router.delete('/deleteMedicineById/:id', deleteMedicineById);

module.exports = router;
