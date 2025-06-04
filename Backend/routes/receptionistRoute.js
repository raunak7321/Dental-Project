const express = require("express");
const route = express.Router();

const { getAllAppointments, createAppointment } = require("../Controllers/appointmentController");
const { auth, isReceptionist } = require('../middlewares/auth');


// Appointment routes
route.post("/createAppointment", auth, isReceptionist, createAppointment);
route.get("/getAllAppointments", auth, isReceptionist, getAllAppointments);


module.exports = route;
