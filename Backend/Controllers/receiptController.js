const Appointment = require("../Models/appointmentModels");
const Receipt = require("../Models/receiptModel");

exports.createReceipt = async (req, res) => {
  try {
    const {
      appId,
      receiptId,
      totalAmount,
      paidAmount,
      paymentStatus,
      patientName,
      mobileNumber,
      address,
      doctorName,
      opdAmount,
      paymentMode,
      transactionId,
      branchId,
      receptionist,
      treatmentType,
    } = req.body;

    // Find appointment by appId
    const appointment = await Appointment.findOne({ appId });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Create receipt
    const receipt = new Receipt({
      receiptId,
      appointmentId: appointment._id,
      totalAmount,
      paidAmount,
      paymentStatus,
      transactionId,
      paymentMode,
      patientName,
      mobileNumber,
      address,
      doctorName,
      opdAmount,
      branchId,
      receptionist,
      treatmentType,
    });

    await receipt.save();

    // Update appointment with receipt reference
    await Appointment.findByIdAndUpdate(appointment._id, {
      $push: { receipts: receipt._id },
      receiptGenerate: true,
    });

    return res.status(201).json({ message: "Receipt generated successfully", receipt });
  } catch (error) {
    console.error("Error creating receipt:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find()
      .populate("appointmentId"); 

    return res.status(200).json(receipts);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getReceiptById = async (req, res) => {
  try {
    const { id } = req.params;

    const receipt = await Receipt.findById(id)
      .populate("appointmentId");

    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    return res.status(200).json(receipt);
  } catch (error) {
    console.error("Error fetching receipt:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateReceiptById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      totalAmount,
      paidAmount,
      paymentStatus,
      patientName,
      mobileNumber,
      address,
      doctorName,
      opdAmount,
      paymentMode,
      transactionId,
      branchId,
      receptionist,
      treatmentType,
      generateInvoice,
      printInovice,
    } = req.body;

    const receipt = await Receipt.findByIdAndUpdate(
      id,
      {
        totalAmount,
        paidAmount,
        paymentStatus,
        patientName,
        mobileNumber,
        address,
        doctorName,
        opdAmount,
        paymentMode,
        transactionId,
        branchId,
        receptionist,
        treatmentType,
        generateInvoice,
        printInovice,
      },
      { new: true }
    );

    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    return res.status(200).json({ message: "Receipt updated successfully", receipt });
  } catch (error) {
    console.error("Error updating receipt:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteReceiptById = async (req, res) => {
  try {
    const { id } = req.params;

    const receipt = await Receipt.findByIdAndDelete(id);

    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    return res.status(200).json({ message: "Receipt deleted successfully" });
  } catch (error) {
    console.error("Error deleting receipt:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getReceiptsWithInvoice = async (req, res) => {
  try {
    const receipts = await Receipt.find({ generateInvoice: true }).populate("appointmentId");
    res.status(200).json({ receipts });
  } catch (error) {
    console.error("Error fetching receipts with invoice:", error);
    res.status(500).json({ message: "Server error" });
  }
};
