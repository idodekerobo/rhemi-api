const express = require('express');
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY)

// Require database in router
const db = require('../models/index');
const bodyParser = require('body-parser');
const { response } = require('express');

const TAX_RATE = 0.1;

function errorHandling(err) {
      console.log();
      console.log('There was an error!');
      console.log(err);
      console.log();
      return res.send(500, { error: err });
}

const calculateOrderAmount = (items) => {
   const subtotal = items.slice().reduce((acc, obj) => (acc += obj.price), 0).toFixed(2);
   const tax = (subtotal * TAX_RATE).toFixed(2);
   const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

   // return (subtotal*100);
   return (total*100); // returning the total w/ sales tax
}

/*
==============================
        CHECKOUT ROUTES
==============================
*/
router.post('/checkout', async (req, res) => {
   // TODO - save the data of the user and their order in the database
   // console.log(req.body);
   const data = req.body;
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
         errorHandling(err);
         return res.status(500).send({
            error: err.message
         });
      }
   });
});

// TEST WEBHOOK
// const webhookSecret = process.env.TEST_WEBHOOK_SECRET;

// LIVE WEBHOOK
const webhookSecret = process.env.LIVE_WEBHOOK_SECRET;

const handleSuccessfulPaymentIntent = (connectedAccountId, paymentIntent) => {
   // fulfill the purchase logic
   console.log('payment intent successfully triggered the webhook!! - idode');
   console.log('Connected account id', connectedAccountId);
   console.log(JSON.stringify(paymentIntent));
}

// trying to send notif that a new order was made to the local server. that way restarurants can see order and details
router.post('/onlineorders', bodyParser.raw({type: 'application/json'}), (req, res) => {
   const sig = req.headers["stripe-signature"];
   let event;

   try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
   } catch (err) {
      console.log(`❌ Error message: ${err.message}`);
      return res.status(400).send(`there's a mf Webhook error!!!: ${err.message}`);
   }

   // TODO - figure out how to extract items out of webhook event so can pass to restaurant
   // TODO - write logic to send to add to order list
   switch (event.type) {
      case 'payment_intent.succeeded':
         // const paymentIntent = event.data.object;
         break;
      case 'payment_method.attached': 
         // const paymentMethod = event.data.object;
         break;
      case 'payment_intent.payment_failed':
         break;
      case 'charge.succeeded':
         // const chargeSuccess = event.data.object;
         break;
      case 'charge.failed': 
         // console.log('charge failed');
         break;
      default:
         return response.status(400).end();
   }

   // returns a 200 response to acknowledge receipt of the event
   res.json({received: true});
});

module.exports = router;