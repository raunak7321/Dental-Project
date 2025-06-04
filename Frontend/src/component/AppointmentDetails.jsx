import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function AppointmentDetails({
  setShowAppointment,
  showAppointment,
  appointmentData,
}) {
  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const navigate = useNavigate();

  console.log(showAppointment, appointmentData);

  return (
    <div className="relative">
      {showAppointment && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowAppointment(false)}
          ></div>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 z-10 overflow-y-auto max-h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Patient Appointment Details
              </h2>
              <button
                onClick={() => setShowAppointment(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-teal-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-teal-800 mb-3">
                  Patient Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {appointmentData.patientName}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {appointmentData.patientType}
                  </p>
                  <p>
                    <span className="font-medium">UHID:</span>{" "}
                    {appointmentData.uhid}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {appointmentData.gender}
                  </p>
                  <p>
                    <span className="font-medium">Age:</span>{" "}
                    {appointmentData.age} years
                  </p>
                  <p>
                    <span className="font-medium">Mobile:</span>{" "}
                    {appointmentData.mobileNumber}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {appointmentData.address}
                  </p>
                </div>
              </div>

              <div className="bg-teal-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-teal-800 mb-3">
                  Medical Details
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Blood Group:</span>{" "}
                    {appointmentData.bloodGroup}
                  </p>
                  <p>
                    <span className="font-medium">Weight:</span>{" "}
                    {appointmentData.weight} kg
                  </p>
                  <p>
                    <span className="font-medium">SpO2:</span>{" "}
                    {appointmentData.spo2}%
                  </p>
                  <div>
                    <p className="font-medium">Medical History:</p>
                    <ul className="list-disc pl-5">
                      {appointmentData.medicalHistory.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Allergies:</p>
                    <ul className="list-disc pl-5">
                      {appointmentData.allergies.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-purple-800 mb-3">
                  Appointment Details
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Appointment ID:</span>{" "}
                    {appointmentData.appId}
                  </p>
                  <p>
                    <span className="font-medium">Doctor:</span>{" "}
                    {appointmentData.doctorName}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {formatDate(appointmentData.appointmentDate)}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span>{" "}
                    {appointmentData.appointmentTime}
                  </p>
                  <p>
                    <span className="font-medium">Check-in Status:</span>{" "}
                    {appointmentData.checkIn ? "Checked In" : "Not Checked In"}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-yellow-800 mb-3">
                  Payment Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Payment Status:</span>{" "}
                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm">
                      {appointmentData.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Payment Mode:</span>{" "}
                    {appointmentData.paymentMode}
                  </p>
                  <p>
                    <span className="font-medium">OPD Amount:</span>{" "}
                    {appointmentData.opdAmount || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Transaction ID:</span>{" "}
                    {appointmentData.transactionId || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(appointmentData.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {new Date(appointmentData.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAppointment(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded mr-2"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigate(`/admin/edit-appointment/${appointmentData._id}`);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded"
              >
                Update Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
