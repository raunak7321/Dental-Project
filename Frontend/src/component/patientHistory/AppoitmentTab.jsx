import React from "react";

const AppointmentTab = ({ patientData }) => {
  if (!patientData) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Appointment Details</h2>
      <div className="bg-gray-50 p-4 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b bg-teal-500">
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Time</th>
              <th className="text-left py-2">Doctor</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Payment Mode</th>
              <th className="text-left py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">
                {new Date(patientData.appointmentDate).toLocaleDateString()}
              </td>
              <td className="py-2">
                {patientData.appointmentTime?.join(", ")}
              </td>
              <td className="py-2">{patientData.doctorName?.join(", ")}</td>
              <td className="py-2">{patientData.status}</td>
              <td className="py-2">{patientData.paymentMode}</td>
              <td className="py-2">₹{patientData.opdAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTab;
