const mongoose = require('mongoose');
let connectdb= require('../config/db');
const { model } = mongoose; 

const chartSchema = new mongoose.Schema({
  sender: {
    type: String,  
    required: true,
  },
  recipient: {
    type: String, 
    required: true,
  },
  timestamp: {
    type: Date,  
    required: true,
  },
  message: {
    type: String,  
    required: true,
  },
}, {
  timestamps: true,  
});

const Chart = mongoose.model('Chart', chartSchema);

module.exports = Chart;
