let express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const upload=require('../config/multer');
const user = require('../models/user');

let app = express();

app.use(bodyParser.json());

app.post('/userdetail', async (req, res) => {
    try {
        const { role, email, phone, country, city, state, pinCode, weight, height, bloodGroup, date,gender } = req.body;
        if (role === 'patient') {
            let user = await User.findOne({ email: email });
            if (!user) {
                return res.status(404).send("User not found");
            }
            user.phone = phone;
            user.country = country.label;
            user.city = city.label;
            user.state = state.label;
            user.pincode = pinCode;
            user.weight = weight;
            user.height = height;
            user.bloodGroup = bloodGroup.label;
            user.dob = date;
            user.gender = gender.value;
            await user.save();
            return res.status(200).send("Data saved successfully");
        } else {
            return res.status(400).send("Invalid role");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
});

app.post('/doctordetail', upload.single('certificate'), async (req, res) => {
    try {
        const { phone, gender, specialization, language, charges, hospital, country, state, city, pinCode, role, email } = req.body;
        const certificate = req.file ? req.file.path : null;


        const labels = language.flat().map(item => item.label);

        console.log(labels);


        if (!certificate) {
            return res.status(400).send('No certificate file uploaded');
        }
        if (role === 'doctor') {
            let user = await Doctor.findOne({ email: email });


            if (!user) {
                return res.status(404).send('User not found');
            }
            user.phone = phone;
            user.specialization = specialization.label;
            user.languages = labels;
            user.charges = charges;
            user.hospital = hospital;
            user.country = country.label;
            user.state = state.label;
            user.city = city.label;
            user.pinCode = pinCode;
            user.gender = gender.label;
            user.certificate = certificate;

            await user.save(); 
            return res.status(200).send('Data saved successfully');
        } else {
            return res.status(400).send('Invalid role');
        }

    } catch (error) {
        console.error('Error updating doctor details:', error);

        return res.status(500).send('Internal server error');
    }
});

app.post('/hospitaldetail', upload.single('certificate'), async (req, res) => {
    try {
        const { phone, email, country, state, city, pinCode, role,specializations, bedCharge} = req.body;
        // console.log(phone, email, country, state, city, pinCode, role, specializations)
       
        const certificate = req.file? req.file.path : null;

        const labels = specializations.flat().map(item => item.label);

        console.log( bedCharge);
        if (!certificate) {
            return res.status(400).send('No certificate file uploaded');
        }
        
        if (role === 'hospital') {
            let user = await Hospital.findOne({ email: email });
            if (!user) {
                return res.status(404).send('User not found');
            }
            user.phone = phone;
            user.country = country.label;
            user.state = state.label;
            user.city = city.label;
            user.pinCode = pinCode;
            user.specialization = labels;
            user.certificate = certificate;
            user.charges =  bedCharge;
            await user.save();
            return res.status(200).send('Data saved successfully');
        } else {
            return res.status(400).send('Invalid role');
        }
    
    }
    catch (error) {
        console.error('Error updating hospital details:', error);
        return res.status(500).send('Internal server error');
    }
});


module.exports = app;