const nodemailer = require('nodemailer');
let express = require('express');
const bodyParser = require('body-parser');
const User=require('../models/user');
const Hospital = require('../models/hospital');
const Doctor=require('../models/doctor');
const Admin = require('../models/admin');

let app = express();
app.use(bodyParser.json()); 

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); 
}

let transporter = nodemailer.createTransport({
  service: 'gmail', 
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'srivastwaadarsh@gmail.com', 
    pass: 'hkvw vikl mqdp pcoz'   
  }
});

app.post('/signup', async (req, res) => {
  try {
    const otp = generateOTP();
    const email = req.body.email;
    let user;
    switch (req.body.role) {
      case 'patient':
        user = await User.findOne({ email });
        break;
      case 'doctor':
        user = await Doctor.findOne({ email });
        break;
      case 'hospital':
        user = await Hospital.findOne({ email });
        break;
        case 'admin':
          user = await Admin.findOne({ email });
          break;
      default:
        return res.status(400).send('Invalid role');
    }

    if (user) {
      return res.status(400).send('User already exists');
    }

    let newUser;
    if (req.body.role === 'patient') {
      newUser = new User({ email, otp });
    } else if (req.body.role === 'doctor') {
      newUser = new Doctor({ email, otp });
    }else if (req.body.role === 'admin') {
      newUser = new Admin({ email, otp });
    }  else 
     {
      newUser = new Hospital({ email, otp });
    }
    await newUser.save();

    // Email options
    const mailOptions = {
      from: {
        name: 'CareSpaceX',
        address: 'srivastwaadarsh@gmail.com',
      },
      to: email,
      subject: 'Your OTP for Authentication',
      html: `<h3>Your OTP is: <strong>${otp}</strong></h3><p>Use this code to authenticate your login.</p>`
    };

    // Send OTP email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send('Error sending OTP: ' + error);
      }
      res.status(200).send('OTP sent successfully!');
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});


app.post('/signin', async (req, res) => {
  let otp = generateOTP(); 
  let email = req.body.email;
  console.log(req.body.email)
  try{
    let user ;
    if(req.body.role==='patient')
    user =await User.findOne({ email: email });
    else if (req.body.role==='doctor')
      user = await Doctor.findOne({ email: email });
    else if(req.body.role==='hospital')
      user = await Hospital.findOne({ email: email });
    else if(req.body.role==='admin')
      user = await Admin.findOne({ email: email });
    
    if (user) {
      user.otp = otp;
      await user.save();
    } else {
      return res.status(404).send({ message: "User not found" }); 
    }
    let mailOptions = {
      from: {
        name: 'CareSpaceX',
        address: 'srivastwaadarsh@gmail.com',
      },
      to: email,  
      subject: 'Your OTP for Authentication',
      html: `<h3>Your OTP is: <strong>${otp}</strong></h3><p>Use this code to authenticate your login.</p>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error); 
        return res.status(500).send({ message: 'Error sending OTP email. Please try again later.' });
      }
      res.status(200).send({ message: 'OTP sent successfully!' });
    });
  } catch (error) {
    console.error("Internal server error:", error);  
    return res.status(500).send({ message: 'Internal server error. Please try again later.' });
  }
});


app.post('/verify-otp',async(req, res) => {
  let email=req.body.email;
  let otp=req.body.otp;

  if(req.body.role==='patient'){
  let user= await User.findOne({email: email});
  user.name=req.body.name;
  await user.save();
  if(user && user.otp === otp){
    res.status(200).send('your registration has been successfully');
  }
}
else if(req.body.role==='doctor'){
  let user= await Doctor.findOne({email: email});
  user.name=req.body.name;
  await user.save();
  if(user && user.otp === otp){
    res.status(200).send('your profile is under review');
  }
}
else
{
  let user= await Hospital.findOne({email: email});
  user.name=req.body.name;
  await user.save();
  if(user && user.otp === otp){
    res.status(200).send('your profile is under review');
  }
}
})


app.post('/login', async (req, res) => {
  try {
    let otp = req.body.otp;
    let email = req.body.email;

    console.log(req.body);

    if (!otp || !email) {
      return res.status(400).json({ message: 'OTP and Email are required' });
    }
    let user ;
    if(req.body.role==='patient')
    user =await User.findOne({ email: email });
    else if (req.body.role==='doctor')
      user = await Doctor.findOne({ email: email });
    else if(req.body.role==='hospital')
      user = await Hospital.findOne({ email: email });
    else if(req.body.role==='admin')
      user =await Admin.findOne({ email: email });

    console.log(user);


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if(user.role==='admin' || user.role==='user') {
      if (user.otp === otp ) {
        return res.status(200).send(user);
      } else {
        return res.status(401).json({ message: 'Invalid OTP' });
      }
    }
   else if (user.otp === otp ) {
      return res.status(200).send(user);
    } else {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = app;
