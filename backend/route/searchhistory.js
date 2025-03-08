let express= require('express');
let Appointment=require('../models/appointment');
const { model } = require('mongoose');

let app=express();


app.post('/patient', async function(req, res){

    let user= await Appointment.find();
    
    res.json(user);

})

module.exports=app;