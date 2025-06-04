import { Settings, User, Shield } from "lucide-react";

export const cards = [
  {
    id: "insurance",
    title: "Insurance",
    icon: <Shield size={24} className="text-teal-600" />,
    color: "bg-teal-500 hover:bg-teal-700",
    borderColor: "border-teal-300",
    iconColor: "text-teal-500",
  },
  {
    id: "clinic",
    title: "Clinic Configuration",
    icon: <Settings size={24} className="text-teal-600" />,
    color: "bg-teal-500 hover:bg-teal-700",
    borderColor: "border-teal-300",
    iconColor: "text-teal-500",
  },
  // {
  //   id: "user",
  //   title: "User",
  //   icon: <User size={24} className="text-purple-600" />,
  //   color: "bg-teal-500 hover:bg-teal-700",
  //   borderColor: "border-purple-300",
  //   iconColor: "text-purple-500",
  // },
  {
    id: "business",
    title: "Business Form",
    icon: <User size={24} className="text-purple-600" />,
    color: "bg-teal-500 hover:bg-teal-700",
    borderColor: "border-purple-300",
    iconColor: "text-purple-500",
  },
];

export const insuranceData = [
  {
    id: 1,
    name: "ABC Insurance",
    address: "123 Main St",
    contact: "555-1234",
    applicable: "Yes",
  },
  {
    id: 2,
    name: "XYZ Healthcare",
    address: "456 Oak Ave",
    contact: "555-5678",
    applicable: "No",
  },
];

export const userData = [
  {
    id: 1,
    branch: "Main",
    staffName: "John Doe",
    userName: "john_doe",
    contact: "555-1111",
    status: "Active",
  },
  {
    id: 2,
    branch: "East",
    staffName: "Jane Smith",
    userName: "jane_smith",
    contact: "555-2222",
    status: "Inactive",
  },
];
