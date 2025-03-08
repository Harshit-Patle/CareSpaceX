const mongoose = require('mongoose');
let connectdb= require('../config/db');
const { model } = mongoose; 

let userschema = new mongoose.Schema({
    name: {type: String, unique: true},
    email: {type: String, required: true, unique: true},
    role: {type: String, default: 'patient'},
    otp: {type: String, default: ''},
    otp_expiry: {type: Date},
    is_verified: {type: Boolean, default: false},
    country: {type: String},
    status: {type: String},
    city: {type: String},
    pincode: {type: String},
    weight:{type:String},
    height:{type:String},
    dob:{type:String},
    gender:{type:String},
    bloodGroup:{type:String},
    phone:{type:String},

});


module.exports = model ('User',userschema);