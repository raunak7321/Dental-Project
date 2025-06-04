import { useNavigate } from 'react-router-dom';

const links = [
  { label: 'Add Appointment', to: '/admin/add-appointment' },
  { label: 'Patient List', to: '/admin/patient-list' },
  { label: 'Invoice', to: '/admin/invoicelist' },
  { label: 'Manage Staff', to: '/admin/manage-staff' },
  { label: 'Manage Branch', to: '/admin/manage-branches' },
];

const QuickLinks = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-6 text-center">
      <h2 className="text-xl font-semibold mb-6">Quick Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {links.map((link, i) => (
          <button
            key={i}
            onClick={() => navigate(link.to)}
            className="bg-gray-100 p-3 rounded-md text-center hover:bg-teal-100 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
