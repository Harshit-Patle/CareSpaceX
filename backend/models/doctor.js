const mongoose = require('mongoose');
let connectdb= require('../config/db');
const { model } = mongoose; 

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, default: "doctor" },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'doctor' },
    otp: { type: String, default: '' },
    otp_expiry: { type: Date },
    is_verified: { type: Boolean, default: false },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    specialization: {
      type: String,
    },
    charges: {
      type: Number,
    },
    hospital: {
      type: String
    },
    certificate: {
      type: String, 
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    pinCode: {
      type: String,
    },
    phone:{
      type: String,
    },
    status:{
      type: String,
      default: 'pending'
    },
    languages: [{
      type: String,
    }]
  },
  { timestamps: true } 
);
 module.exports = User = mongoose.model('Doctor', doctorSchema);