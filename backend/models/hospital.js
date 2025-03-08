const mongoose = require('mongoose');
let connectdb= require('../config/db');
const { model } = mongoose; 

const HospitalDetailsSchema = new mongoose.Schema({
    name: { type: String, unique: true, default: "hospital" },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'hospital' },
    otp: { type: String, default: '' },
    otp_expiry: { type: Date },
    is_verified: { type: Boolean, default: false },
  phone: {
    type: String,
  },
  certificate: {
    type: String,
  },
  specialization:[{
    type:String, 
  }],
  charges: {
    type: Number,
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
  status:{
    type: String,
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const HospitalDetails = mongoose.model('hospitals', HospitalDetailsSchema);

module.exports = HospitalDetails;
