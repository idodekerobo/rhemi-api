const express = require('express');
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY)

// Require database in router
const db = require('../models/index');

// do i want to start w/ api???
// EVERY URL STARTS WITH /API/

const TAX_RATE = 0.1;

function mongoDbErrorHandling(err) {
      console.log();
      console.log('There was an error!');
      console.log(err);
      console.log();
      // return res.send(err);
      return res.send(500, { error: err });
}

const calculateOrderAmount = (items) => {
   const subtotal = items.slice().reduce((acc, obj) => (acc += obj.price), 0).toFixed(2);
   const tax = (subtotal * TAX_RATE).toFixed(2);
   const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

   return (subtotal*100);
}

/*
==============================
        CHECKOUT ROUTES
==============================
*/
// router.post('/checkout', async (req, res) => {
router.post('/checkout', async (req, res) => {

   // TODO - save the data of the user and their order in the database
   const data = req.body;
   console.log();
   console.log('data coming from client', data);
   console.log();
   const amount = calculateOrderAmount(data.items);

   await stripe.paymentIntents.create(
      {
         payment_method_types: ['card'],
         amount: amount,
         currency: 'usd',
         // application_fee_amount: 0 // if there's no application fee than just have it 0
      }, 
      {
         stripeAccount: process.env.TEST_CONNET_ACCOUNT_ID,
      })
      .then( (paymentIntent) => {
      try {
         return res.send({
            publishableKey: process.env.STRIPE_TEST_PUBLISHABLE_KEY,
            clientSecret: paymentIntent.client_secret,
         });
      } catch (err) {
         // TODO - handle errors here, would be a server/network error
         return res.status(500).send({
            error: err.message
         });
      }
   });
});

// router.get('/checkout', async (req, res) => {

// });

module.exports = router;