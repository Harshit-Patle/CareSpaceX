let express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const appointment = require('../models/appointment');
const bed=require('../models/bed');

let app = express();

app.post('/appointment', async (req, res) => {
    let email = req.body.email;
    try {
        let user = await appointment.find({ doctor: email, status: 'pending' });
            res.status(200).send(user);
        
    } 
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving appointments');
    }
});

app.post('/bed', async (req, res) => {
    let email = req.body.email;
    try {
        let users = await bed.find({ 
            Hospital: email 
        });

        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving beds');
    }
});



app.post('/update', async (req, res) => {
    try {
        const { approval, unique } = req.body;
        const id = unique;
        const user = await appointment.findOne({ _id: id });

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


app.post('/updatebed', async (req, res) => {
    try {
        const { approval, unique } = req.body;
        const id = unique;
        const user = await bed.findOne({ _id: id });
        console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'bed not found' });
        }

        console.log(user);
        user.status = approval;
        await user.save();

        return res.status(200).json({ message: 'Appointment updated successfully', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports = app;