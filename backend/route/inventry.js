const express = require('express');
const inventry = require('../models/inventry');
const Hospital = require('../models/hospital');

let app = express();

app.use(express.json());

app.post('/inventory', async (req, res) => {

    let email = req.body.newInventory.email;

    let user= await Hospital.find({ email: email });
    try {
        const newItem = new inventry({
          Hospital: user[0].name,
          email: email,
          type: req.body.newInventory.type,
          name: req.body.newInventory.name,
          quantity: req.body.newInventory.quantity,
          phone:user[0].phone,
        });

        await newItem.save();
        return res.status(200).json({ message: 'Item added to inventory successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

app.post('/collect', async (req, res) => {
    try {
        const userItems = await inventry.find({ Hospital: req.body.email });
        
        if (!userItems || userItems.length === 0) {
            return res.status(404).json({ message: 'No inventory found for this hospital.' });
        }

        return res.status(200).json({ items: userItems });
    } catch (error) {
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = app;
