const express = require('express');
const app = express();
const cors = require('cors');
const database = require("./Config/db")

require("dotenv").config();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const { cloudinaryConnect } = require("./Config/cloudinary");

const userRoutes = require("./routes/userRoute");
const receptionistRoutes = require("./routes/receptionistRoute");
const appointmentRoute = require('./routes/appointmentsRoute');
const examinationRoute = require('./routes/examinationRoute');
const procedureRoute = require('./routes/procedureRoute');
const prescriptionRoute = require('./routes/prescriptionRoute');
const staffRoute = require("./routes/staffRoute");
const branchRoute = require("./routes/branchRoute");
const dentistRoute = require("./routes/dentistRoute");
const servicesRoute = require("./routes/servicesRoute");
const contactRoutes = require("./routes/contactRoutes")
const dashboardRoute = require("./routes/dashboardRoute")
const planRouter = require("./routes/planRoute");
const businessRoutes = require("./routes/businessRoute");
const treatmentRoutes = require("./routes/treatmentRoutes");
const receiptRoutes = require("./routes/receiptRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const ClinicConfig = require("./routes/clinicConfigRoutes");
const pediatricRoute = require("./routes/pediatricRoute");
const fileRoutes = require("./routes/fileRoute");

//cors
app.use(cors());
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://dental-w7jc.onrender.com'
    ],
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));


// Middleware
app.use(express.json()); // to parse JSON
app.use(express.urlencoded({ extended: true })); // to parse form-data
app.use(bodyParser.json());
database.connectDb()

app.use("/uploads", express.static("uploads"));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

cloudinaryConnect();
// Routes
app.use("/api/user", userRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/invoices',invoiceRoutes);
app.use("/api/receptionist", receptionistRoutes);
app.use("/api/appointments", appointmentRoute);
app.use("/api/examinations", examinationRoute);
app.use("/api/procedures", procedureRoute);
app.use("/api/prescriptions", prescriptionRoute);
app.use("/api/staff", staffRoute);
app.use("/api/branch", branchRoute);
app.use("/api/dentist", dentistRoute);
app.use("/api/services", servicesRoute);
app.use("/api", dashboardRoute);
app.use('/api/contacts', contactRoutes);
app.use("/api/plan", planRouter);
app.use("/api/business", businessRoutes);
app.use("/api/treatment", treatmentRoutes)
app.use("/api/clinic-config", ClinicConfig); 
app.use('/api/pediatric', pediatricRoute);
app.use('/api/saveAllData', treatmentRoutes);
app.use("/api/files", fileRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
