const Appointment = require("../Models/appointmentModels");

// ✅ GET - All Appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json({
      success: true,
      appointmentList: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

// ✅ POST - Book Appointment
const generateUHID = async () => {
  // Find the latest appointment to get the next sequential number
  const latestAppointment = await Appointment.findOne().sort({ createdAt: -1 });

  let sequentialNumber = 1; // Default start

  if (latestAppointment) {
    // If there's an existing UHID, extract the number and increment
    const existingUhid = latestAppointment.uhid;
    if (existingUhid) {
      const match = existingUhid.match(/UHID-(\d+)/);
      if (match && match[1]) {
        sequentialNumber = parseInt(match[1]) + 1;
      }
    }
  }

  // Format with padded zeros (e.g., 001, 012, 123)
  const paddedNumber = String(sequentialNumber).padStart(3, "0");
  return `UHID-${paddedNumber}`;
};

const getNextAppointmentId = async () => {
  // Get the latest appointment to determine the next appId
  const latestAppointment = await Appointment.findOne().sort({ createdAt: -1 });

  // Start with 1 if no appointments exist
  if (!latestAppointment || !latestAppointment.appId) {
    return 1;
  }

  // Parse the existing ID as a number and increment
  const currentId = parseInt(latestAppointment.appId);
  return isNaN(currentId) ? 1 : currentId + 1;
};

exports.createAppointment = async (req, res) => {
  try {
    const requiredFields = [
      "patientType",
      "patientName",
      "gender",
      "mobileNumber",
      "age",
      "address",
      "doctorName",
      "paymentMode",
      "status",
      "bp",
      "appointmentType",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required.`,
        });
      }
    }

    let uhid;

    if (req.body.appointmentType === "New") {
      uhid = await generateUHID(); // generate new UHID
    } else if (req.body.appointmentType === "Revisited") {
      if (!req.body.uhid) {
        return res.status(400).json({
          success: false,
          message: "UHID is required for revisited appointment.",
        });
      }
      uhid = req.body.uhid; // use provided UHID
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid appointmentType. Must be 'New' or 'Revisited'.",
      });
    }

    const appId = await getNextAppointmentId();

    const newAppointment = new Appointment({
      ...req.body,
      uhid,
      appId,
    });

    const appointmentDetails = await newAppointment.save();

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointmentDetails,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error booking appointment",
      error: error.message,
    });
  }
};

// ✅ GET - Appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointment",
      error: error.message,
    });
  }
};

exports.getAppointmentByAppId = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ appId: req.params.id });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointment",
      error: error.message,
    });
  }
};

exports.updateCheckIn = async (req, res) => {
  try {
    const appid = req.params.id;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appid },
      { isPatient: true },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Check-in updated successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating check-in",
      error: error.message,
    });
  }
};

// ✅ PUT - Update Appointment
exports.updateAppointment = async (req, res) => {
  try {
    // Prevent updating of auto-generated IDs
    if (req.body.appId || req.body.uhid) {
      return res.status(400).json({
        success: false,
        message: "Cannot update appId or uhid fields",
      });
    }

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      updatedAppointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating appointment",
      error: error.message,
    });
  }
};

// ✅ DELETE - Cancel Appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling appointment",
      error: error.message,
    });
  }
};

exports.getPatientByUHID = async (req, res) => {
  try {
    const patient = await Appointment.findOne({ uhid: req.params.uhid });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found with this UHID",
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching patient by UHID",
      error: error.message,
    });
  }
};

exports.deletePatientByUHID = async (req, res) => {
  try {
    const deletedPatient = await Appointment.findOneAndDelete({
      uhid: req.params.uhid,
    });

    if (!deletedPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found with this UHID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting patient by UHID",
      error: error.message,
    });
  }
};

exports.updateReceiptGenerate = async (req, res) => {
  try {
    const { id } = req.params; // This is appId
    const { receiptGenerate } = req.body;

    if (typeof receiptGenerate !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "receiptGenerate must be a boolean (true or false)",
      });
    }

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { appId: id },
      { receiptGenerate },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "receiptGenerate updated successfully",
      updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating receiptGenerate",
      error: error.message,
    });
  }
};

exports.updateInvoiceGenerate = async (req, res) => {
  try {
    const { id } = req.params; // This is appId
    const { InvoiceGenerate } = req.body;

    if (typeof receiptGenerate !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "InvoiceGenerate must be a boolean (true or false)",
      });
    }

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { appId: id },
      { InvoiceGenerate },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "InvoiceGenerate updated successfully",
      updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating InvoiceGenerate",
      error: error.message,
    });
  }
};


