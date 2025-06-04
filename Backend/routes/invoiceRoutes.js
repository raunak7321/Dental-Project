const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoiceById,
  deleteInvoiceById,
  getInvoicesWithInvoice,
  getInvoicesByAppointmentId, // Updated function name
} = require("../Controllers/invoiceController");

// Route to create a invoice
router.post("/create", createInvoice);
router.get("/getAllInvoices", getAllInvoices);
router.get("/getInvoiceById/:id", getInvoiceById);
router.patch("/updateInvoiceById/:id", updateInvoiceById);
router.delete("/deleteInvoiceById/:id", deleteInvoiceById);

// Add the new route for getting invoices by appointment ID
router.get("/getInvoicesByAppointmentId/:id", getInvoicesByAppointmentId);

router.get("/getAllInvoice", getInvoicesWithInvoice);

module.exports = router;
