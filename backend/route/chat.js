let express = require('express');
const bodyParser = require('body-parser');
let chat = require('../models/chat');
let Doctor=require('../models/doctor');
let User=require('../models/user');

let app = express();


app.post('/chat', async function(req, res) {
    try {
        let users = await chat.find({
            $or: [
                { sender: req.body.sender, recipient: req.body.recipient },
                { sender: req.body.recipient, recipient: req.body.sender }
            ]
        });

        if (users.length === 0) {
            res.json({ message: "Hello, how can I help you?" });
        } else {
            const allSortedMessages = users.map(user => {
                const sortedMessages = Array.isArray(user.messages)
                    ? user.messages.sort((a, b) => b.timestamp - a.timestamp)
                    : []; 

                return {
                    ...user.toObject(),  
                    sortedMessages
                };
            });
            res.json(allSortedMessages); 
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred." });
    }
});




app.post('/doctor', async(req, res) => {
    state=req.body.state;
    city=req.body.city;
    country=req.body.country;
    let user = await Doctor.find({
        state: state,
        city: city,
        country: country
      });
      console.log(user);
      res.json(user);
})

app.post('/save', async(req, res) => {

    let Chat = new chat({
        sender: req.body.sender,
        recipient: req.body.recipient,
        message: req.body.newMessage.text.text,
        timestamp:req.body.newMessage.text. timestamp,
    });
    Chat.save();
    res.status(200).json({ message:"Data saved." });

});

app.post('/patient', async(req, res) => {
    let user = await chat.find({
        recipient:req.body.recipient,
      });
      res.json(user);
})

app.post('/patientlist', async (req, res) => {
    let user;
    let users = [];

    for (let i = 0; i < req.body.uniqueRecipients.length; i++) {
        user = await User.find({ email: req.body.uniqueRecipients[i] });
        users.push(...user);
    }
    res.json(users);
});












module.exports =app;