const express = require('express');
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY)
const functions = require('../services/functions');

// Require database in router
// const db = require('../models/index');
// const bodyParser = require('body-parser');

/*
=======================================
        ONBOARD CUSTOMER ROUTES
=======================================
*/
router.post('/signup-rhemi', async (req, res) => {
   const { priceId } = req.body; // pass in price id?? is this the same as api id? 
   try {
      const session = await stripe.checkout.sessions.create({
         mode: 'subscription',
         payment_method_types: ['card'],
         line_items: [
            {
               price: priceId,
               // For metered billing, do not pass quantity
               quantity: 1,
            },
         ],
         // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
         // the actual Session ID is returned in the query parameter when your customer is redirected to the success page.
         // TODO - need to direct them to a page to set up their stripe account here
         // success_url: 'https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}', 
         success_url: 'https://localhost:5000/', 
         // TODO - direct them to the homepage here
         // cancel_url: 'https://example.com/canceled.html',
         cancel_url: 'https://localhost:5000/',
      });
      res.send({
         sessionId: session.id,
      });
   } catch (e) {
      res.status(400);
      return res.send({
         error: {
            message: e.message,
         }
      });
   }
});

router.post('/signup-user-stripe-acct', async (req, res) => {
   try {
      const account = await stripe.accounts.create({
         type: "standard"
      });

      const accountLink = await stripe.accountLinks.create({
         account: account.id,
         refresh_url: 'https://www.rhemi.co', // give refresh url if user doesn't complete
         return_url: 'https://www.rhemi.co', // return url when finished
         type: 'account_onboarding',
      });

      // req.session.accountID = account.id;

      // const origin = `${req.headers.origin}`;
      // const accountLinkURL = await generateAccountLink(account.id, origin);
      res.send({ url: accountLink.url });
   } catch (err) {
      console.log(`there was an error redirecting to stripe to create connected account`);
      console.log(err);
      res.status(500).send({
         error: err.message,
      });
   }
});
module.exports = router;