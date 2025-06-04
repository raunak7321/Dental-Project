const express = require('express');
const router = express.Router();
const { createReceipt, getAllReceipts, getReceiptById, updateReceiptById, deleteReceiptById, getReceiptsWithInvoice } = require('../Controllers/receiptController');

// Route to create a receipt
router.post('/create', createReceipt);
router.get('/getAllReceipts', getAllReceipts);
router.get('/getReceiptById/:id', getReceiptById);
router.patch('/updateReceiptById/:id', updateReceiptById);
router.delete('/deleteReceiptById/:id', deleteReceiptById);
router.delete('/deleteReceiptById/:id', deleteReceiptById);

router.get('/getAllInvoice', getReceiptsWithInvoice);

module.exports = router;
