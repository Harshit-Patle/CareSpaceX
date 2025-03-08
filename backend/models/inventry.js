const mongoose = require('mongoose');
let connectdb= require('../config/db');
const { model } = mongoose; 

const inventoryItemSchema ={
    Hospital:{
        type: String,
        required: true,
    },
      type: { type: String,required: true},
      name: { type: String,required: true},
      quantity: { type: Number,required: true},
      phone:{ type: String,required: true},
      email:{ type: String,required: true},
  };

  const Inventory = mongoose.model('Inventory', inventoryItemSchema);

  module.exports = Inventory;

