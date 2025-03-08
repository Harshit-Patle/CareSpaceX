const nodemailer = require('nodemailer');
let express = require('express');
const bodyParser = require('body-parser');
const User=require('../models/user');
const Hospital = require('../models/hospital');
const Doctor=require('../models/doctor');


let app = express();

app.post('/new', async (req, res) => {
  try {
    const { city, state, country } = req.body;
    const doctors = await Hospital.find();
    const filteredDoctors = doctors.filter(
      (doctor) =>
        doctor.city === city &&
        doctor.state === state &&
        doctor.country === country
    );
    if (filteredDoctors.length > 0) {
      res.json({ doctors: filteredDoctors });
    } else {
      res.status(404).send("No doctors found in this location.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong!");
  }
});




module.exports =app;