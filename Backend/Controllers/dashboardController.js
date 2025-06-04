const Appointment = require( "../Models/appointmentModels");
const Dentist = require( "../Models/dentistModel");
const User = require( "../Models/userModel");
const { getLastMonth, getSevenDaysAgo, getThreeMonthsAgo, getTodayRange } = require( "../utils/date");

//admin
exports.dashboardDetails = async(req,res) => {
    try{ 
        //doctors
        const totalDoctors = await User.countDocuments({ opdAmount: { $exists: true } });
        const doctorList = await User.find(
          { opdAmount: { $exists: true, $ne: null } }, // ensures opdAmount exists and is not null
          { firstName: 1, lastName: 1, _id: 0 } // fetch only these fields
        );
        const {start: todayStart, end: todayEnd} = getTodayRange();
        const sevenDaysAgo = getSevenDaysAgo()
        const lastMonth = getLastMonth()
        const threeMonthsAgo = getThreeMonthsAgo()

        //patients
        const totalPatients = await Appointment.countDocuments({isPatient: true});
        const todayPatients = await Appointment.countDocuments({
            isPatient: true,
            createdAt: { $gte: todayStart, $lte: todayEnd },
        });
        const last7DaysPatients = await Appointment.countDocuments({
            isPatient: true,
            createdAt: { $gte: sevenDaysAgo },
        });
        const lastMonthPatients = await Appointment.countDocuments({
            isPatient: true,
            createdAt: { $gte: lastMonth },
        });
        const last3MonthsPatients = await Appointment.countDocuments({
            isPatient: true,
            createdAt: { $gte: threeMonthsAgo },
        });
        
          // Appointments
        const totalAppointments = await Appointment.countDocuments();
        const todayAppointments = await Appointment.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd },
        });
        const last7DaysAppointments = await Appointment.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
        });
        const last3MonthsAppointments = await Appointment.countDocuments({
        createdAt: { $gte: threeMonthsAgo },
        });

        //for graph
        const dailyPatientCounts = await Appointment.aggregate([
            {
              $match: {
                isPatient: true,
                createdAt: {
                  $gte: sevenDaysAgo, 
                },
              },
            },
            {
              $addFields: {
                dayOfWeek: { $dayOfWeek: "$createdAt" }, // Sunday = 1, Saturday = 7
              },
            },
            {
              $group: {
                _id: "$dayOfWeek",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                day: {
                  $arrayElemAt: [
                    [ "", "Sund", "Mond", "Tues", "Wed", "Thur", "Fri", "Sat" ],
                    "$_id",
                  ],
                },
                count: 1,
              },
            },
            {
              $sort: { _id: 1 }, // Sunday to Saturday
            },
          ]);
          


        return res.status(200).json({
          success: true,
          totalDoctors,
          doctorNames: doctorList.map(
            (doc) => `${doc.firstName} ${doc.lastName}`
          ),
          totalAppointments,
          todayAppointments,
          last7DaysAppointments,
          last3MonthsAppointments,
          totalPatients,
          todayPatients,
          last7DaysPatients,
          lastMonthPatients,
          last3MonthsPatients,
          dailyPatientCounts,
        });
    }catch(error) {
        return res.status(400).json({
            success:false,
            message:`Error in fetching detail: ${error.message}`
        })
    }
}

//receptionist
exports.dashboard = async(req,res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    try{ 
        //doctors
       

        //patients
        const totalPatients = await Appointment.countDocuments({isPatient: true});
       
        
          // Appointments
        const totalAppointments = await Appointment.countDocuments();
        const upcomingAppointments = await Appointment.find({
            appointmentDate: { $gte: today }
          }).select('doctorName patientName mobileNumber paymentMode opdAmount');
       


        return res.status(200).json({
            success: true,
            totalAppointments,
            upcomingAppointments,
            totalPatients,
          
        });
    }catch(error) {
        return res.status(400).json({
            success:false,
            message:`Error in fetching detail: ${error.message}`
        })
    }
}

