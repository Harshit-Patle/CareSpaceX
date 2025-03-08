let express = require('express');
const bodyParser = require('body-parser');
const User=require('../models/user');
const Hospital = require('../models/hospital');
const Doctor=require('../models/doctor');
const inventry=require('../models/inventry');
const doctor = require('../models/doctor');
let Appointment = require('../models/appointment');

let app = express();

app.post('/available',async(req,res)=>{
    let user=await inventry.find();
    console.log(user);
    if(user){
        res.status(200).send(user);
    }
    else{
        res.status(404).send('No medicines found');
    }
    
})

app.post('/detail', async function(req, res) {
    try {
        let email = req.body.prescriptionData.patientEmail;

        let user = await Appointment.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let medications = req.body.prescriptionData.medications;

        if (medications && Array.isArray(medications) && medications.length > 0) {
            user.prescription = medications.map(med => {
                if (!med.name || !med.dosage || !med.startDate || !med.endDate) {
                    throw new Error('Missing required medication fields');
                }

                const startDate = new Date(med.startDate);
                const endDate = new Date(med.endDate);

                // Ensure startDate is not later than endDate
                if (startDate > endDate) {
                    throw new Error('Start date cannot be after end date');
                }

                return {
                    name: med.name,
                    dosage: med.dosage,
                    startDate: med.startDate,
                    endDate: med.endDate,
                };
            });
        } else {
            return res.status(400).json({ message: 'Invalid medications data' });
        }

        user.doctorNotes = req.body.prescriptionData.doctorNotes;
        user.treatment = 'confirmed';

        await user.save();

        res.status(200).json({ message: 'User updated successfully', user: user });

    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});







module.exports =app;