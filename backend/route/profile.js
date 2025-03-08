let express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const upload=require('../config/multer');
const user = require('../models/user');

let app = express();

app.post('/doctor', async (req, res) => {
    try {
        let email = req.body.email;
        let user = await Doctor.find({ email: email, status: { $ne: 'pending' } });
        console.log(user);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/user', async (req, res) => {
    try {
        let email = req.body.email;
        let User = await user.find({ email: email });
        console.log(user);
        if (User.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        return res.status(200).json(User);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/hospital', async (req, res) => {
    try {
        let email = req.body.email;
        let user = await Hospital.find({ email: email });
        console.log(user);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = app;