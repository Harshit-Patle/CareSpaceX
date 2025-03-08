const nodemailer = require('nodemailer');
let express = require('express');
const bodyParser = require('body-parser');
const User=require('../models/user');
const Hospital = require('../models/hospital');
const Doctor=require('../models/doctor');
let dotenv = require('dotenv');
const Payment = require('../models/payment.js');
const Razorpay = require('razorpay');
const Appointment=require('../models/appointment.js');
const Bed = require('../models/bed.js');


let app = express();


dotenv.config();

app.use(bodyParser.json());


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,   
    key_secret: process.env.RAZORPAY_KEY_SECRET  
  });
  
  app.post('/create/orderId', async (req, res) => {

    const options = {
      amount: req.body.price*100,

      currency: "INR",
    };
  
    try {
      const order = await razorpay.orders.create(options); 
      res.send(order);
      await Payment.create({
        orderId: order.id,
        amount: order.amount / 100, 
        currency: order.currency,
        status: 'pending',
      });
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      res.status(500).send('Error creating order');
    }
  });
  
  app.post('/api/payment/verify', async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
    const crypto = require('crypto');
  
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');
  
    if (generatedSignature === signature) {
      try {
        // Update the payment status in the database
        await Payment.findOneAndUpdate(
          { orderId: razorpayOrderId },
          { paymentId: razorpayPaymentId, signature, status: 'completed' }
        );
  
        const date = req.body.formData.date;
        const targetDate = new Date(date).getTime();
        
        if (isNaN(targetDate)) {
          return res.status(400).send('Invalid date format');
        }
  
        const appointment = new Appointment({
          patient: req.body.formData.patientName,
          issue: req.body.formData.issue,
          doctor: req.body.formData.doctor,
          date: targetDate, 
          timeSlot: req.body.formData.timeSlot,
          email: req.body.formData.email,
        });
  
        await appointment.save();
  
        res.send('Payment verified and appointment created successfully');
      } catch (error) {
        console.error('Error saving appointment:', error);
        res.status(500).send('Internal server error');
      }
    } else {
      res.status(400).send('Payment verification failed');
    }
  });


  app.post('/api/payment/verify/bed', async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
    const crypto = require('crypto');
  
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');
  
    if (generatedSignature === signature) {
      try {
        // Update the payment status in the database
        await Payment.findOneAndUpdate(
          { orderId: razorpayOrderId },
          { paymentId: razorpayPaymentId, signature, status: 'completed' }
        );
  
  
  
        console.log(req.body.formData.hospital)
        console.log(req.body.formData.patientName)
        console.log(req.body.formData.issue)
        const user = new Bed({
          Hospital: req.body.formData.hospital,
          patient: req.body.formData.patientName,
          issue: req.body.formData.reason,
          email: req.body.formData.email,
        });
  
        // Save the appointment to the database
        await user.save();
  
        res.send('Payment verified and appointment created successfully');
      } catch (error) {
        console.error('Error saving appointment:', error);
        res.status(500).send('Internal server error');
      }
    } else {
      res.status(400).send('Payment verification failed');
    }
  });
  

  module.exports = app;