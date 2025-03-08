import React, { useState, useEffect } from 'react';
import { Search, User, Calendar, Clock, Stethoscope, FileText, X } from 'lucide-react';
import axios from 'axios';

// PatientHistory component
const PatientHistory = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/search/patient",
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        setError("Something went wrong!");
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient.toLowerCase().includes(searchTerm.toLowerCase()) || // Include name in search
    patient.issue.toLowerCase().includes(searchTerm.toLowerCase()) // Include issue in search
  );

  const openPrescriptionModal = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const closePrescriptionModal = () => {
    setSelectedPrescription(null);
  };

  const PrescriptionModal = ({ prescription, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-purple-600 hover:text-purple-800"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-purple-800 mb-4">Prescription Details</h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Doctor's Notes</h3>
            <p className="text-purple-600">{prescription.doctorNotes}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Medications</h3>
            <div className="space-y-3">
              {prescription.map((med, index) => (
                <div
                  key={index}
                  className="bg-purple-50 p-3 rounded-md border border-purple-100"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-purple-800">{med.name}</p>
                      <p className="text-purple-600 text-sm">Dosage: {med.dosage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-purple-600">
                        {med.startDate} to {med.endDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search by email, name, or issue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-3.5 text-purple-500" />
        </div>

        {loading ? (
          <div className="text-center py-10 text-purple-600">
            <div className="spinner">Loading...</div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : (
          <>
            {searchTerm ? (
              <div className="space-y-4">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map(patient => (
                    <div
                      key={patient.id}
                      className="bg-white shadow-md rounded-lg p-5 border border-purple-100 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                          <User className="text-purple-600" />
                          <h2 className="text-xl font-semibold text-purple-800">{patient.patient}</h2>
                        </div>
                        <button
                          onClick={() => openPrescriptionModal(patient.prescription)}
                          className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors flex items-center space-x-2"
                          disabled={!patient.prescription || patient.prescription.length === 0}
                        >
                          <FileText size={18} />
                          <span>Prescription</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-purple-700">
                        <div className="flex items-center space-x-2">
                          <Calendar size={18} className="text-purple-500" />
                          <span>{new Date(patient.date).toLocaleDateString()}</span> {/* Formatted date */}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={18} className="text-purple-500" />
                          <span>{patient.timeSlot}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Stethoscope size={18} className="text-purple-500" />
                          <span>{patient.doctor}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User size={18} className="text-purple-500" />
                          <span>{patient.email}</span>
                        </div>
                      </div>

                      <div className="mt-4 bg-purple-50 p-3 rounded-md">
                        <h3 className="text-purple-700 font-medium">Issue: {patient.issue}</h3>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-purple-600 py-10">
                    No patients found matching your search.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-purple-600 py-10">
                <p>Start typing an email, name, or issue to search for patient records</p>
              </div>
            )}
          </>
        )}

        {selectedPrescription && (
          <PrescriptionModal
            prescription={selectedPrescription}
            onClose={closePrescriptionModal}
          />
        )}
      </div>
    </div>
  );
};

export default PatientHistory;
