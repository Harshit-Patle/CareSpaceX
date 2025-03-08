let express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const appointment = require('../models/appointment');
const bed=require('../models/bed');

let app = express(); 

app.post('/doctor', async (req, res) => {
    let user = await Doctor.find({ status: 'pending' });

    console.log(user);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).send('No pending doctors found');
    }
});

app.post('/update', async (req, res) => {
    try {
        const { approval, unique } = req.body;
        const id = unique;
        const user = await Doctor.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        console.log(user);
        user.status = approval;
        await user.save();

        return res.status(200).json({ message: 'Appointment updated successfully', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

app.post('/hospital', async (req, res) => {
    let user = await Hospital.find({ status: 'pending' });

    console.log(user);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).send('No pending doctors found');
    }
});

app.post('/updatehospital', async (req, res) => {
    try {
        const { approval, unique } = req.body;
        const id = unique;
        const user = await Hospital.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        console.log(user);
        user.status = approval;
        await user.save();

        return res.status(200).json({ message: 'Appointment updated successfully', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})





module.exports =app;