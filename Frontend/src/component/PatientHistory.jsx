import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import PatientSidebar from "./patientHistory/PatientSideBar";
import TabNavigation from "./patientHistory/TabNavigation";
import OverviewTab from "./patientHistory/OverViewTab";
import AppointmentTab from "./patientHistory/AppoitmentTab";
import TreatmentTab from "./patientHistory/TreatmentTab";
import BillingTab from "./patientHistory/BillingTab";
import PrescriptionTab from "./patientHistory/PrescriptionTab";
import TimeLineTab from "./patientHistory/TimeLineTab";
import FilesTab from "./patientHistory/FilesTab";

const PatientHistory = () => {
  const { id } = useParams(); // Get patient ID from URL
  const [activeTab, setActiveTab] = useState("overview");
  const [patientData, setPatientData] = useState({});
  const [treatmentData, setTreatmentData] = useState({});
  const [prescriptionData, setPrescriptionData] = useState({}); // Fixed variable name
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_BASE_URL
          }/appointments/getAppointment/${id}`
        );
        setPatientData(response.data.appointment);
        console.log(response, "patient data");
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  // Fetch treatment data
  useEffect(() => {
    const fetchTreatmentData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_BASE_URL
          }/saveAllData/getTreatmentById/${id}`
        );

        // Access the correct property from the response
        if (response.data.success && response.data.data) {
          setTreatmentData(response.data.data);
          console.log(response.data.data, "treatment data");
        } else {
          console.error("No treatment data found");
        }
      } catch (error) {
        console.error("Error fetching treatment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatmentData();
  }, [id]);

  // Fetch all invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        // Use the correct endpoint that matches your updated route
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_APP_BASE_URL
          }/invoices/getInvoicesByAppointmentId/${id}`
        );
        setInvoices(data);
        console.log(data, "invoices data");
        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch invoices");
        console.error(err);
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [id]);

  // Fetch prescription data - Fixed to match backend response format
 useEffect(() => {
   const fetchPrescriptionData = async () => {
     try {
       console.log("Fetching prescription data for ID:", id);

       const prescriptionUrl = `${
         import.meta.env.VITE_APP_BASE_URL
       }/prescriptions/getPrescriptionByExaminationById/${id}`;

       const response = await axios.get(prescriptionUrl);
       console.log("Prescription API response:", response.data);

       // Modified this part to correctly access the prescription property
       if (response.data.success && response.data.prescription) {
         setPrescriptionData(response.data.prescription);
         console.log(
           "Successfully set prescription data:",
           response.data.prescription
         );
       } else {
         console.warn("Prescription API returned:", response.data);
         setPrescriptionData({});
         toast.info("No prescription records found");
       }
     } catch (error) {
       console.error("Error fetching prescription data:", error);
       setPrescriptionData({});

       if (error.response?.status === 404) {
         toast.info("No prescriptions found for this patient");
       } else {
         toast.error(`Prescription data error: ${error.message}`);
       }
     } finally {
       setLoading(false);
     }
   };

   fetchPrescriptionData();
 }, [id]);

  const renderContent = () => {
    const tabProps = {
      patientData,
      treatmentData,
      invoices,
      prescriptionData, 
    };

    switch (activeTab) {
      case "overview":
        return <OverviewTab {...tabProps} />;
      case "appointment":
        return <AppointmentTab {...tabProps} />;
      case "treatment":
        return <TreatmentTab {...tabProps} />;
      case "billing":
        return <BillingTab {...tabProps} />;
      case "prescription":
        return <PrescriptionTab {...tabProps} />;
      case "timeline":
        return <TimeLineTab {...tabProps} />;
      case "files":
        return <FilesTab {...tabProps} />;
      default:
        return <div>Select a tab</div>;
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!patientData)
    return <div className="p-4 text-red-500">Patient not found</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <PatientSidebar patientData={patientData} />

      <div className="flex-1 flex flex-col">
        <div className="bg-teal-500 text-white border">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-white">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;
