import React, { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Prescription = () => {
    const navigate = useNavigate();
    const [patientEmail, setPatientEmail] = useState('');
    const [doctorNotes, setDoctorNotes] = useState('');
    const [medications, setMedications] = useState([
        { name: '', dosage: '', startDate: '', endDate: '' }
    ]);

    // Add new medication row
    const addMedication = () => {
        setMedications([
            ...medications,
            { name: '', dosage: '', startDate: '', endDate: '' }
        ]);
    };

    // Remove medication row
    const removeMedication = (indexToRemove) => {
        setMedications(medications.filter((_, index) => index !== indexToRemove));
    };

    // Update medication field
    const updateMedication = (index, field, value) => {
        const newMedications = [...medications];
        newMedications[index][field] = value;
        setMedications(newMedications);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form data
        if (!patientEmail) {
            alert('Please enter patient email');
            return;
        }

        // Prepare prescription data
        const prescriptionData = {
            patientEmail,
            doctorNotes,
            medications
        };

        // TODO: Send data to backend/database
        console.log('Prescription Data:', prescriptionData);

        // Optional: Reset form or show success message
        alert('Prescription saved successfully!');
    };

    // Handle cancel action
    const handleCancel = () => {
        // Ask for confirmation before canceling
        const confirmCancel = window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.');

        if (confirmCancel) {
            // Navigate back to previous page or dashboard
            navigate(-1);
        }
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-2xl mx-auto bg-purple-50 p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-purple-800 mb-6">Create Prescription</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Patient Email */}
                    <div>
                        <label className="block text-purple-700 font-semibold mb-2">
                            Patient Email
                        </label>
                        <input
                            type="email"
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                            placeholder="Enter patient's email"
                            className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    {/* Doctor's Notes */}
                    <div>
                        <label className="block text-purple-700 font-semibold mb-2">
                            Doctor's Notes
                        </label>
                        <textarea
                            value={doctorNotes}
                            onChange={(e) => setDoctorNotes(e.target.value)}
                            placeholder="Enter detailed notes about patient's condition"
                            rows={4}
                            className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Medications Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl text-purple-800 font-semibold">Medications</h2>
                            <button
                                type="button"
                                onClick={addMedication}
                                className="bg-purple-500 text-white px-3 py-2 rounded-md hover:bg-purple-600 transition-colors flex items-center space-x-2"
                            >
                                <Plus size={18} />
                                <span>Add Medication</span>
                            </button>
                        </div>

                        {medications.map((med, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-12 gap-3 mb-4 items-center"
                            >
                                {/* Medication Name */}
                                <div className="col-span-3">
                                    <input
                                        type="text"
                                        value={med.name}
                                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                                        placeholder="Medication Name"
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                {/* Dosage */}
                                <div className="col-span-3">
                                    <input
                                        type="text"
                                        value={med.dosage}
                                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                                        placeholder="Dosage"
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                {/* Start Date */}
                                <div className="col-span-2">
                                    <input
                                        type="date"
                                        value={med.startDate}
                                        onChange={(e) => updateMedication(index, 'startDate', e.target.value)}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                {/* End Date */}
                                <div className="col-span-2">
                                    <input
                                        type="date"
                                        value={med.endDate}
                                        onChange={(e) => updateMedication(index, 'endDate', e.target.value)}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                {/* Remove Button */}
                                <div className="col-span-2 flex justify-center">
                                    {medications.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeMedication(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Button Container */}
                    <div className="flex space-x-4 pt-4">
                        {/* Cancel Button */}
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="w-1/2 bg-gray-200 text-purple-800 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                        >
                            <X size={20} />
                            <span>Cancel</span>
                        </button>

                        {/* Save Button */}
                        <button
                            type="submit"
                            className="w-1/2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                        >
                            <Save size={20} />
                            <span>Save Prescription</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Prescription;