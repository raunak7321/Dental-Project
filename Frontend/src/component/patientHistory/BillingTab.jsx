import React from "react";

const BillingTab = ({ invoices }) => {
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

  // Calculate total billed and paid amounts
  const calculateTotals = () => {
    if (!invoices || invoices.length === 0) {
      return { total: 0, paid: 0, pending: 0 };
    }

    return invoices.reduce(
      (acc, invoice) => {
        const subtotal = Number(invoice.subtotal) || 0;
        const netPayable = Number(invoice.netPayable) || 0;
        const paid = Number(invoice.paid) || 0;

        return {
          total: acc.total + subtotal,
          paid: acc.paid + paid,
          pending: acc.pending + (netPayable - paid),
        };
      },
      { total: 0, paid: 0, pending: 0 }
    );
  };

  const totals = calculateTotals();

  return (
    <div className="bg-white p-4 space-y-6 w-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-gray-600">Total Billed</p>
          <p className="text-2xl font-semibold text-blue-700">
            ₹{totals.total.toFixed(2)}
          </p>
        </div>
        {/* <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="text-sm text-gray-600">Total Paid</p>
          <p className="text-2xl font-semibold text-green-700">
            ₹{totals.paid.toFixed(2)}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
          <p className="text-sm text-gray-600">Balance Due</p>
          <p className="text-2xl font-semibold text-orange-700">
            ₹{totals.pending.toFixed(2)}
          </p>
        </div> */}
      </div>

      {/* Billing Table */}
      <div>
        <h2 className="text-lg font-medium text-gray-700 mb-2">
          Invoice History
        </h2>
        <div className="border border-gray-200 rounded">
          <table className="w-full">
            <thead className="bg-teal-500">
              <tr>
                <th className="py-2 px-4 text-left text-sm text-gray-700">
                  Invoice No
                </th>
                <th className="py-2 px-4 text-left text-sm text-gray-700">
                  Date
                </th>
                <th className="py-2 px-4 text-left text-sm text-gray-700">
                  Bill Amount
                </th>
                <th className="py-2 px-4 text-left text-sm text-gray-700">
                  Discount
                </th>
                <th className="py-2 px-4 text-left text-sm text-gray-700">
                  Net Payable
                </th>
              </tr>
            </thead>
            <tbody>
              {!invoices || invoices.length === 0 ? (
                <tr className="border-t border-gray-200">
                  <td colSpan="8" className="py-4 px-4 text-sm text-center">
                    No billing data available
                  </td>
                </tr>
              ) : (
                invoices.map((invoice, index) => {
                  const subtotal = Number(invoice.subtotal) || 0;
                  const netPayable = Number(invoice.netPayable) || 0;

                  return (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-2 px-4 text-sm">
                        {invoice.invoiceId || `INV-${index + 1000}`}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        {formatDate(invoice.createdAt)}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        ₹{subtotal.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        ₹{(invoice.discount || 0).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-sm">
                        ₹{netPayable.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingTab;
