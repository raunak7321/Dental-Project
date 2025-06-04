import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import FirstAdultDentistryForm from "../component/FirstAdultDentistryForm";
import TreatmentProcedure from "../component/TreatmentProcedure";
import axios from "axios";

export default function AdultDentistry() {
  const { id } = useParams();
  const [patient, setPatient] = useState({});
  const [selectedTeeth, setSelectedTeeth] = useState({});
  const [showTreatment, setShowTreatment] = useState(true);
  const [finalProcedures, setFinalProcedures] = useState([]);
  const [finalTreatmentRecords, setFinalTreatmentRecords] = useState([]);
  const [adultdentistryTooth, setAdultdentistryTooth] = useState();
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    toothName: "",
    dentalCondition: "",
    complaint: "",
    examination: "",
    advice: "",
  });

  const [records, setRecords] = useState([]);


  const fetchDataForPatient = async () => {
    const res = await axios.get(
      `${
        import.meta.env.VITE_APP_BASE_URL
      }/appointments/getAppointmentByAppId/${id}`
    );
    setPatient(res.data.appointment);
  };

  useEffect(() => {
    fetchDataForPatient();
  }, []);

  const location = useLocation();
  const examinationData = location.state?.records || [];

  useEffect(() => {
    console.log("Received ID from route:", id);
  }, [id]);

  const handleNext = (name) => {
    setAdultdentistryTooth(name);
    setShowTreatment(false);
  };

  return showTreatment ? (
    <FirstAdultDentistryForm
      id={id}
      saved={saved}
      setSaved={setSaved}
      records={records}
      setRecords={setRecords}
      patient={patient}
      selectedTeeth={selectedTeeth}
      showTreatment={showTreatment}
      setSelectedTeeth={setSelectedTeeth}
      formData={formData}
      handleNext={handleNext}
      setFormData={setFormData}
    />
  ) : (
    <TreatmentProcedure
      id={id}
      toothName={adultdentistryTooth}
      finalProcedures={finalProcedures}
      setFinalProcedures={setFinalProcedures}
      finalTreatmentRecords={finalTreatmentRecords}
      examinationData={examinationData}
      records={records}
      setRecords={setRecords}
      patient={patient}
      setFinalTreatmentRecords={setFinalTreatmentRecords}
      setShowTreatment={setShowTreatment}
    />
  );
}
