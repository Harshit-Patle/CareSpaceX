let express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const appointment = require('../models/appointment');
const { model } = require('mongoose');
let bed=require('../models/bed');

let app = express();

app.post('/user',async(req,res)=>{
    let email=req.body.email;
    console.log(email);
    let user=await appointment.find({email:email})
    if(user){
        res.status(200).send(user);
    }
    else{
        res.status(404).send('No appointment found');
    }
})

app.post('/bed',async(req,res)=>{
    let email=req.body.email;
    let user=await bed.find({email:email})
    console.log(user)
    if(user){
        res.status(200).send(user);
    }
    else{
        res.status(404).send('No appointment found');
    }
})

module.exports =app;


