const express = require('express');
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY)
const functions = require('../services/functions');

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

/*
==============================
        CHECKOUT ROUTES
==============================
*/
router.post('/checkout', async (req, res) => {
   // TODO - save the data of the user and their order in the database
   // console.log(req.body);
   const data = req.body;
   const amount = functions.calculateOrderAmount(data.items);

   await stripe.paymentIntents.create(
      {
         payment_method_types: ['card'],
         amount: amount.stripeTotal,
         currency: 'usd',
         // application_fee_amount: 0 // if there's no application fee then remove it (having it be 0 causes an error)
      }, 
      {
         stripeAccount: process.env.TEST_STRIPE_CONNECT_ACCOUNT_ID,
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

const webhookSecret = process.env.TEST_STRIPE_WEBHOOK_SECRET; // TEST WEBHOOK
// const webhookSecret = process.env.LIVE_STRIPE_WEBHOOK_SECRET; // LIVE WEBHOOK

const handleSuccessfulPaymentIntent = (connectedAccountId, paymentIntent) => {
   // fulfill the purchase logic
   console.log('payment intent successfully triggered the webhook!! - idode');
   console.log('Connected account id', connectedAccountId);
   console.log(JSON.stringify(paymentIntent));
}

// trying to send notif that a new order was made to the local server. that way restarurants can see order and details
router.post('/onlineorders', bodyParser.raw({type: 'application/json'}), (req, res) => {
   const sig = req.headers["stripe-signature"];
   console.log('webhook request: ', req);
   // can grab payment_intent from raw req data to look up the contents of the order
   // can grab receipt_email, receipt_url
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
         const chargeSuccess = event.data.object;
         console.log();
         console.log('charge.succeeded webhook: ', chargeSuccess);
         // retrieve charge ID from stripe API and send to database
         // can grab payment_intent from raw req data to look up the contents of the order
         // 
         // can grab receipt_email, receipt_url
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