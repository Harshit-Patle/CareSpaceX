const mongoose = require('mongoose');
let connectdb= require('../config/db');
const { model } = mongoose; 

const formSchema = {
    patient: {
        type: 'string',
        required: true,
    },
    email: {
        type: 'string',
        required: true,
    },
    issue: {
        type: 'string',
        required: true,
    },
    date: {
        type: 'string', 
        required: true,
    },
    timeSlot: {
        type: 'string',
        required: true,
        enum: ['morning', 'evening'],
    },
    status: {
        type: 'string',
        default: 'pending',  
        enum: ['pending', 'confirmed'], 
    },
    doctor: {
        type: 'string',
        required: true,
    },
    doctorNotes: { 
        type: 'string', 
    },
    treatment: {
        type: 'string',
        default: 'pending', 
    },
    prescription: {
        type: [
            {
                name: {
                    type: 'string',
                    required: true,
                },
                dosage: {
                    type: 'string',
                    required: true,
                },
                startDate: {
                    type: 'date',
                    required: true,
                },
                endDate: {
                    type: 'date',
                    required: true,
                },
            }
        ],
        default: [],
    },
};

const Form = model('Form', formSchema);

module.exports = Form;