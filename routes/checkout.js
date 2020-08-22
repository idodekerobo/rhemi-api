const express = require('express');
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY)

// Require database in router
const db = require('../models/index');

// do i want to start w/ api???
// EVERY URL STARTS WITH /API/

function mongoDbErrorHandling(err) {
      console.log();
      console.log('There was an error!');
      console.log(err);
      console.log();
      // return res.send(err);
      return res.send(500, { error: err });
}

/*
==============================
        CHECKOUT ROUTES
==============================
*/
// router.post('/checkout', async (req, res) => {
router.post('/checkout', async (req, res) => {
   console.log('request body', req.body);
   var lineItems = [];
   req.body.items.forEach(item => {
      const itemObj = {
         price_data: {
            currency: 'usd',
            product_data: {
               name: item.name,
            },
            unit_amount: item.price*100,
         },
         // tax_rates: [],
         quantity: 1,
      }
      lineItems.push(itemObj);
   });
   const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      // amount_subtotal: req.body.subtotal,
      // amount_total: req.body.total,
      mode: "payment",
      success_url: "http://localhost:3000/", // would need to figure out how to post a notif that it was successful
      cancel_url: "http://localhost:3000/", // would need to figure out how to post a notif that you cancelled order or went back
   });

   res.json({ id: session.id });
})

module.exports = router;