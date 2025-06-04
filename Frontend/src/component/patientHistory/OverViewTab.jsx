import React from "react";

const OverviewTab = ({ patientData, treatmentData, invoices }) => {
  if (!patientData) return null;

  // Ensure treatmentData is an array before using flatMap
  const treatmentArray = Array.isArray(treatmentData) ? treatmentData : [];

  // Flatten all procedureList items from the treatmentData array
  const allProcedures = treatmentArray.flatMap(
    (item) => item.procedureList || []
  );

  // Format date to DD-MM-YY format
  const formatDate = (dateString) => {
    if (!dateString) return "NA";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "NA"; // Invalid date

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "NA";
    }
  };

  return (
    <div className="bg-white p-4 space-y-6 w-full">
      {/* Appointments Section */}
      <div>
        <h2 className="text-lg font-medium text-gray-700 mb-2">Appointments</h2>
        <div className="border border-gray-200 rounded">
          <table className="w-full">
            <thead className="border-b bg-teal-500">
              <tr>
                <th className="text-left py-2 px-4">Date</th>
                <th className="text-left py-2 px-4">Time</th>
                <th className="text-left py-2 px-4">Doctor</th>
                <th className="text-left py-2 px-4">Status</th>
                <th className="text-left py-2 px-4">Payment Mode</th>
                <th className="text-left py-2 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4">
                  {formatDate(patientData.appointmentDate)}
                </td>
                <td className="py-2 px-4">
                  {patientData.appointmentTime?.join(", ") || "NA"}
                </td>
                <td className="py-2 px-4">
                  {patientData.doctorName?.join(", ") || "NA"}
                </td>
                <td className="py-2 px-4">{patientData.status || "NA"}</td>
                <td className="py-2 px-4">{patientData.paymentMode || "NA"}</td>
                <td className="py-2 px-4">₹{patientData.opdAmount || "NA"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Left Column */}
      <div className="space-y-6">
        {/* Treatment Section */}
        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-2">Treatment</h2>
          <div className="border border-gray-200 rounded">
            <table className="w-full">
              <thead className="bg-teal-500">
                <tr>
                  <th className="py-2 px-4 text-left text-sm text-gray-700">
                    Procedure
                  </th>
                  <th className="py-2 px-4 text-left text-sm text-gray-700">
                    Treatment
                  </th>
                  <th className="py-2 px-4 text-left text-sm text-gray-700">
                    Sitting
                  </th>
                  <th className="py-2 px-4 text-left text-sm text-gray-700">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {allProcedures.length > 0 ? (
                  allProcedures.map((proc, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-2 px-4 text-sm">{proc.procedure}</td>
                      <td className="py-2 px-4 text-sm">{proc.treatment}</td>
                      <td className="py-2 px-4 text-sm">{proc.sitting}</td>
                      <td className="py-2 px-4 text-sm">₹{proc.cost}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-gray-200">
                    <td colSpan="4" className="py-2 px-4 text-sm text-center">
                      No treatment data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bill Section */}
        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-2">Bill</h2>
          <div className="border border-gray-200 rounded">
            <table className="w-full">
              <thead className="bg-teal-500">
                <tr>
                  <th className="py-2 px-4 text-left text-sm text-gray-700">
                    Date
                  </th>
                  <th className="py-2 px-4 text-left text-sm text-gray-700">
                    Bill Amount
                  </th>
                  <th className="py-2 px-4 text-left text-sm text-gray-700">
                    Paid Amount
                  </th>
                  <th className="py-2 px-4 text-left text-sm text-gray-700">
                    Discount
                  </th>
                </tr>
              </thead>
              <tbody>
                {!invoices || invoices.length === 0 ? (
                  <tr className="border-t border-gray-200">
                    <td colSpan="4" className="py-4 px-4 text-sm text-center">
                      No billing data available
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-2 px-4 text-sm">
                        {formatDate(invoice.createdAt)}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        ₹{invoice.subtotal || "NA"}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        ₹{invoice.netPayable || "NA"}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        ₹{invoice.discount || "0"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
