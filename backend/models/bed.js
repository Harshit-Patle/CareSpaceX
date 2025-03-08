const mongoose = require('mongoose');
let connectdb= require('../config/db');
const { model } = mongoose; 

const formSchema = {
    patient: {
        type: 'string',
        required: true,
    },
    issue: {
        type: 'string',
        required: true,
    },
    email:{
        type: 'string',
        required: true,
    },
    status: {
        type: 'string',
        default: 'pending',  
        enum: ['pending', 'confirmed'], 
    },
    Hospital: {
        type: 'string',
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    }
};

const Form = model('Bed', formSchema);

module.exports = Form;
