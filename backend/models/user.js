const mongoose = require('mongoose');
let connectdb= require('../config/db');
const { model } = mongoose;

let userschema = new mongoose.Schema({
    name: { type: String, unique: true, default: "patient" },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
    otp: { type: String, default: '' },
    otp_expiry: { type: Date },
    is_verified: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
      phone: { type: String },
      gender: { type: String, enum: ['male', 'female', 'other'] },
      dob: { type: Date },
      weight: { type: Number },
      height: { type: Number },
      bloodGroup: { 
        type: String, 
      },
      status:{
        type: String,
        default: 'approved'
      },
    //   location: {
    //     country: { type: String },
    //     state: { type: String },
    //     city: { type: String },
    //     pinCode: { type: String },
    //   },
    country: { type: String },
        state: { type: String },
        city: { type: String },
        pinCode: { type: String },
    });
  
  module.exports = model('User', userschema);
  