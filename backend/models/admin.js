const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin'
  },
  otp: {
    type: String,
    required: true
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  languages: {
    type: [String],  
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const admin = mongoose.model('admin', userSchema);
module.exports = admin;
