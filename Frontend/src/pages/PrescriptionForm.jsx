import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

export default function PrescriptionForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [patientData, setPatientData] = useState(null);
  const [diagnosisList, setDiagnosisList] = useState(() => {
    const saved = localStorage.getItem("diagnosisList");
    return saved ? JSON.parse(saved) : [];
  });
  const [newDiagnosis, setNewDiagnosis] = useState("");

  useEffect(() => {
    localStorage.setItem("diagnosisList", JSON.stringify(diagnosisList));
  }, [diagnosisList]);

  const savePrescriptionItems = (items) => {
    localStorage.setItem(`prescription_${id}`, JSON.stringify(items));
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL
        }/appointments/getAppointmentByAppId/${id}`
      );
      setPatientData(res.data.appointment);

      const savedItems = localStorage.getItem(`prescription_${id}`);
      if (savedItems) {
        setPrescriptionItems(JSON.parse(savedItems));
      }

      const dummyData = {
        clinicName: "Smiles Dental Care",
        doctorName: "Dr. XYZ (BDS, MDS)",
        patient: {
          name: "Ankita",
          age: 28,
          gender: "female",
          date: "07-Apr-2025",
        },
        medicalHistory: ["Toothache", "Sensitivity"],
        tests: "X-Ray",
        advice: "Avoid cold drinks and sweets.",
        prescriptionItems: [
          {
            name: "Somparaz 40",
            dosage: "1 tsp",
            timing: "Before meal",
          },
          {
            name: "Brevipil 100",
            dosage: "1-1",
            timing: "After meal, twice a day",
          },
        ],
      };
    };

    fetchData();
  }, [id]);

  const [diagnosis, setDiagnosis] = useState("");
  const [tests, setTests] = useState("");
  const [advice, setAdvice] = useState("");

  const [medicineSearch, setMedicineSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prescriptionItems, setPrescriptionItems] = useState([]);

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [dosage, setDosage] = useState("");
  const [timing, setTiming] = useState("");

  const fetchMedicines = async () => {
    if (!medicineSearch.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/services/getAllMedicine`
      );
      const data = await response.json();

      if (data.success && Array.isArray(data.medicines)) {
        const filtered = data.medicines.filter((med) =>
          med.name.toLowerCase().includes(medicineSearch.toLowerCase())
        );
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setSearchResults([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (medicineSearch.trim()) {
        fetchMedicines();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [medicineSearch]);

  const handleSearchClick = () => {
    fetchMedicines();
  };

  const handleSelectMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setSearchResults([]);
    setMedicineSearch("");
  };

  const addDiagnosis = () => {
    if (newDiagnosis.trim()) {
      setDiagnosisList([...diagnosisList, newDiagnosis.trim()]);
      setNewDiagnosis("");
    }
  };

  const removeDiagnosis = (index) => {
    const updatedList = [...diagnosisList];
    updatedList.splice(index, 1);
    setDiagnosisList(updatedList);
  };

  const addMedicineToPrescription = () => {
    if (!selectedMedicine || !dosage.trim() || !timing.trim()) return;
    const updatedItems = [
      ...prescriptionItems,
      {
        name: selectedMedicine.name,
        dosage,
        timing,
      },
    ];
    setPrescriptionItems(updatedItems);
    savePrescriptionItems(updatedItems);
    setSelectedMedicine(null);
    setDosage("");
    setTiming("");
  };

  const removePrescriptionItem = (index) => {
    const updatedItems = [...prescriptionItems];
    updatedItems.splice(index, 1);
    setPrescriptionItems(updatedItems);
    savePrescriptionItems(updatedItems);
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    const leftMargin = 15;
    const rightMargin = 195;
    const lineSpacing = 8;
    let y = 15;

    const formattedDate = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const prescriptionInfo = {
      clinicName: "Smiles Dental Care",
      doctorName: `Dr. ${patientData?.doctorName || "XYZ (BDS, MDS)"}`,
      patient: {
        name: patientData?.patientName || "N/A",
        age: patientData?.age || "N/A",
        gender: patientData?.gender || "N/A",
        date: formattedDate,
      },
      diagnosis: diagnosisList || [],
      tests: tests || "N/A",
      advice: advice || "N/A",
      prescriptionItems: prescriptionItems || [],
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(prescriptionInfo.clinicName, 105, y, null, null, "center");

    y += lineSpacing;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(prescriptionInfo.doctorName, 105, y, null, null, "center");

    y += lineSpacing + 4;
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y, rightMargin, y);

    // Section: Patient Details
    y += lineSpacing;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Patient Details", leftMargin, y);

    y += lineSpacing;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Name: ${prescriptionInfo.patient.name}`, leftMargin, y);
    doc.text(`Age: ${prescriptionInfo.patient.age}`, 90, y);
    doc.text(`Gender: ${prescriptionInfo.patient.gender}`, 140, y);

    y += lineSpacing;
    doc.text(`Date & Time: ${prescriptionInfo.patient.date}`, leftMargin, y);

    // Section: Diagnosis
    y += lineSpacing + 4;
    doc.setFont("helvetica", "bold");
    doc.text("Diagnosis", leftMargin, y);

    y += lineSpacing;
    doc.setFont("helvetica", "normal");
    if (prescriptionInfo.diagnosis.length > 0) {
      prescriptionInfo.diagnosis.forEach((item) => {
        doc.text(`• ${item}`, leftMargin + 5, y);
        y += lineSpacing;
      });
    } else {
      doc.text("N/A", leftMargin + 5, y);
      y += lineSpacing;
    }

    // Section: Tests
    y += lineSpacing;
    doc.setFont("helvetica", "bold");
    doc.text("Tests", leftMargin, y);

    y += lineSpacing;
    doc.setFont("helvetica", "normal");
    doc.text(prescriptionInfo.tests, leftMargin + 5, y);

    // Section: Advice
    y += lineSpacing + 4;
    doc.setFont("helvetica", "bold");
    doc.text("Advice", leftMargin, y);

    y += lineSpacing;
    doc.setFont("helvetica", "normal");
    const adviceLines = doc.splitTextToSize(prescriptionInfo.advice, 180);
    doc.text(adviceLines, leftMargin + 5, y);
    y += adviceLines.length * lineSpacing;

    // Section: Medicines
    y += lineSpacing;
    doc.setFont("helvetica", "bold");
    doc.text("Prescribed Medicines", leftMargin, y);

    y += lineSpacing;
    doc.setFont("helvetica", "normal");
    if (prescriptionInfo.prescriptionItems.length > 0) {
      prescriptionInfo.prescriptionItems.forEach((item) => {
        const itemText = `• ${item.name} - ${item.dosage} - ${item.timing}`;
        doc.text(itemText, leftMargin + 5, y);
        y += lineSpacing;
      });
    } else {
      doc.text("N/A", leftMargin + 5, y);
      y += lineSpacing;
    }

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Get well soon! For any concerns, call us at +91-XXXXXXXXXX",
      105,
      285,
      null,
      null,
      "center"
    );

    doc.save(`prescription-${prescriptionInfo.patient.name}.pdf`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleSaveAndPrint = async () => {
    if (!patientData) return;

    const payload = {
      appointmentId: id,
      diagnosis: diagnosisList,
      tests,
      advice,
      prescriptionItems,
      doctorName: patientData.doctorName,
      patientName: patientData.patientName,
      age: patientData.age,
      gender: patientData.gender,
      date: patientData.date,
      appDate: patientData.appointmentDate,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/prescriptions/createPrescription`,
        payload
      );
      if (res.status === 201) {
        console.log("Prescription saved:", res.data);
        handlePrintPDF();
      } else {
        alert("Failed to save prescription. Try again.");
      }
    } catch (err) {
      console.error("Error saving prescription:", err);
      alert("Error saving prescription. Check console.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 shadow-lg font-sans bg-white">
      <div className="pb-4 mb-6 border-b-2 border-teal-700">
        <h1 className="text-3xl font-bold text-teal-700">Prescription</h1>
        <div className="flex justify-between items-end mt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
            <span className="font-bold text-black text-lg">Dr. Name: </span>
            <p className="text-xl text-gray-700 col-span-3">
              {patientData?.doctorName}
            </p>
          </div>
          <p className="text-sm text-black px-16">
            <span className="font-bold">Date: </span>
            {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-4 text-sm">
          <div>
            <span className="font-bold text-black">Patient: </span>
            {patientData?.patientName}
          </div>
          <div>
            <span className="font-bold text-black">Age: </span>
            {patientData?.age}
          </div>
          <div>
            <span className="font-bold text-black">Gender: </span>
            {patientData?.gender}
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-black py-2">Appt. Date: </span>
            <p className="text-sm text-gray-700 mt-2">
              {patientData?.appointmentDate
                ? formatDate(patientData.appointmentDate)
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="mt-4">
            <h3 className="text-2xl font-bold mb-4 text-teal-700">
              2. Diagnosis
            </h3>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newDiagnosis}
                onChange={(e) => setNewDiagnosis(e.target.value)}
                placeholder="Enter diagnosis"
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={addDiagnosis}
                className="px-3 py-2 bg-teal-700 text-white rounded text-sm hover:bg-teal-800"
              >
                Add
              </button>
            </div>

            <ul className="space-y-1">
              {diagnosisList.map((item, index) => (
                <li
                  key={index}
                  className="bg-gray-100 text-sm text-gray-800 px-3 py-1 rounded flex justify-between items-center"
                >
                  <span>{item}</span>
                  <button
                    onClick={() =>
                      setDiagnosisList(
                        diagnosisList.filter((_, i) => i !== index)
                      )
                    }
                    className="text-gray-400 hover:text-red-500 text-lg px-2"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2 text-teal-700">
              2. Tests
            </h3>
            <textarea
              value={tests}
              onChange={(e) => setTests(e.target.value)}
              placeholder="Recommended tests"
              className="w-full p-2 border border-gray-300 rounded text-sm h-20"
            />
          </div>

          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2 text-teal-700">
              3. Advice
            </h3>
            <textarea
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              placeholder="Advice for patient"
              className="w-full p-2 border border-gray-300 rounded text-sm h-20"
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-teal-700 border-b border-teal-700 pb-2">
              Rx
            </h2>

            <div className="mb-4">
              <div className="flex mb-2">
                <input
                  type="text"
                  value={medicineSearch}
                  onChange={(e) => setMedicineSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearchClick()}
                  placeholder="Search medicine..."
                  className="flex-1 p-2 border border-gray-300 rounded-l text-sm"
                />
                <button
                  onClick={handleSearchClick}
                  className="px-4 py-2 bg-teal-700 text-white rounded-r hover:bg-teal-800 text-sm"
                >
                  {loading ? "Loading..." : "Search"}
                </button>
              </div>

              {loading && (
                <div className="text-center py-2 text-sm text-gray-500 bg-gray-100 rounded">
                  <p>Searching medicines...</p>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="bg-white border border-gray-200 rounded shadow-sm max-h-40 overflow-y-auto">
                  <div className="bg-gray-100 px-2 py-1 text-xs text-gray-500">
                    Found {searchResults.length} medicine(s)
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {searchResults.map((medicine) => (
                      <li
                        key={medicine.id}
                        onClick={() => handleSelectMedicine(medicine)}
                        className="p-2 hover:bg-gray-50 cursor-pointer text-sm flex justify-between items-center"
                      >
                        <span>{medicine.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchResults(
                              searchResults.filter(
                                (med) => med.id !== medicine.id
                              )
                            );
                          }}
                          className="text-gray-400 hover:text-red-500 p-1 text-xs"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {medicineSearch && searchResults.length === 0 && !loading && (
                <div className="text-center py-2 text-sm text-gray-500 bg-gray-100 rounded">
                  No medicines found matching "{medicineSearch}"
                </div>
              )}
            </div>

            {selectedMedicine && (
              <div className="bg-white p-3 rounded border border-gray-200 mb-4 relative">
                <button
                  onClick={() => {
                    setSelectedMedicine(null);
                    setDosage("");
                    setTiming("");
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 text-xl"
                >
                  ✕
                </button>

                <p className="font-medium text-sm mb-2">
                  {selectedMedicine.name}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <select
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Select Dosage</option>
                    <option value="1 tablet">1 tablet</option>
                    <option value="1 tsp">1 tsp</option>
                    <option value="1-0-1">1-0-1</option>
                    <option value="0-1-0">0-1-0</option>
                    <option value="1-1-1">1-1-1</option>

                    <option value="As directed">As directed</option>
                  </select>

                  <input
                    type="text"
                    value={timing}
                    onChange={(e) => setTiming(e.target.value)}
                    placeholder="Timing (e.g. After meals)"
                    className="p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <button
                  onClick={addMedicineToPrescription}
                  className="w-full p-2 bg-teal-700 text-white rounded hover:bg-teal-800 text-sm"
                >
                  Add Medicine to Prescription
                </button>
              </div>
            )}

            <div className="space-y-3">
              {prescriptionItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded border border-gray-200 relative flex items-start"
                >
                  <div className="flex-1">
                    <p className="font-medium text-teal-700">{item.name}</p>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                      <p>
                        <span className="text-gray-600">Dosage:</span>{" "}
                        {item.dosage}
                      </p>
                      <p>
                        <span className="text-gray-600">Timing:</span>{" "}
                        {item.timing}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removePrescriptionItem(index)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {prescriptionItems.length === 0 && (
                <p className="text-gray-500 text-sm italic text-center py-2">
                  No medicines prescribed yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
        >
          ⬅ Back
        </button>
        <button
          onClick={handleSaveAndPrint}
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save & Print PDF
        </button>
      </div>
    </div>
  );
}
