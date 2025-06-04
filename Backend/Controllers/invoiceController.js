const Appointment = require("../Models/appointmentModels");
const Invoice = require("../Models/invoiceModel");

exports.createInvoice = async (req, res) => {
  try {
    const {
      appId,
      invoiceId,
      patientName,
      mobileNumber,
      address,
      doctorName,
      treatmentType,
      branchId,
      receptionist,
      createdAt,
      services,
      discount,
      subtotal,
      netPayable,
    } = req.body;

    const appointment = await Appointment.findOne({ appId });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const invoice = new Invoice({
      invoiceId,
      appointmentId: appointment._id,
      patientName,
      mobileNumber,
      address,
      doctorName,
      treatmentType,
      branchId,
      receptionist,
      createdAt,
      services,
      discount,
      subtotal,
      netPayable,
      generateInvoice: true,
    });

    await invoice.save();

    await Appointment.findByIdAndUpdate(appointment._id, {
      $push: { invoices: invoice._id },
      invoiceGenerate: true,
    });

    return res.status(201).json({ message: "Invoice generated successfully", invoice });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("appointmentId"); 

    return res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate("appointmentId");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Add this new function to your invoiceController.js

exports.getInvoicesByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Find the appointment(s) for this patient
    const appointments = await Appointment.find({ patientId });
    
    if (!appointments || appointments.length === 0) {
      return res.json([]);  // Return empty array if no appointments found
    }
    
    // Get all appointment IDs
    const appointmentIds = appointments.map(app => app._id);
    
    // Find invoices related to these appointments
    const invoices = await Invoice.find({ 
      appointmentId: { $in: appointmentIds } 
    }).populate('appointmentId');
    
    return res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices by patient ID:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getInvoicesByAppointmentId = async (req, res) => {
  try {
    const { id } = req.params; // This is the appointment ID from URL

    // Find invoices directly associated with this appointment ID
    const invoices = await Invoice.find({
      appointmentId: id,
    }).populate("appointmentId");

    console.log(`Found ${invoices.length} invoices for appointment ID: ${id}`);
    return res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices by appointment ID:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      patientName,
      mobileNumber,
      address,
      doctorName,
      treatmentType,
      branchId,
      receptionist,
      createdAt,
      services,
      discount,
      subtotal,
      netPayable,
      generateInvoice,
      printInovice,
    } = req.body;

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      {
        patientName,
        mobileNumber,
        address,
        doctorName,
        treatmentType,
        branchId,
        receptionist,
        createdAt,
        services,
        discount,
        subtotal,
        netPayable,
        generateInvoice,
        printInovice,
      },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.status(200).json({ message: "Invoice updated successfully", invoice });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.deleteInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByIdAndDelete(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getInvoicesWithInvoice = async (req, res) => {
  try {
    const invoices = await Invoice.find({ generateInvoice: true }).populate("appointmentId");
    res.status(200).json({ invoices });
  } catch (error) {
    console.error("Error fetching invoices with invoice:", error);
    res.status(500).json({ message: "Server error" });
  }
};
