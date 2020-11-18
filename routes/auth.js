const express = require('express');
const router = express.Router();
require('dotenv').config();

const admin = require("firebase-admin");
admin.initializeApp({
   credential: admin.credential.cert({
      "type": process.env.FIREBASE_ACCT,
      "project_id": process.env.FIREBASE_ACCT_PROJ_ID,
      "private_key_id": process.env.FIREBASE_ACCT_PRIV_KEY_ID,
      "private_key": process.env.FIREBASE_ACCT_PRIV_KEY.replace(/\\n/g, '\n'),
      "client_email": process.env.FIREBASE_ACCT_CLIENT_EMAIL,
      "client_id": process.env.FIREBASE_ACCT_CLIENT_ID,
      "auth_uri": process.env.FIREBASE_ACCT_AUTH_URI,
      "token_uri": process.env.FIREBASE_ACCT_TOKEN_URI,
      "auth_provider_x509_cert_url": process.env.FIREBASE_ACCT_AUTH_PROVIDER,
      "client_x509_cert_url": process.env.FIREBASE_ACCT_CLIENT_X509_CERT
   }),
   databaseURL: "https://dash-7174b.firebaseio.com"
});

// Require database in router
const db = require('../models/index');

// EVERY URL STARTS WITH /API/

function mongoDbErrorHandling(err) {
   console.log();
   console.log('There was an error on the node server!');
   console.log(err);
   console.log();
   // return res.send(err);
   return res.send(500, { error: err });
}

// this function needs to validate the credentials and return a JWT if they match
// if not what should i return?
const checkAuth = (req, res, next) => {
   // const email = req.body.email;
   // const password = req.body.password
   const { email, password } = req.body;

   // need to verify that this is an authenticated user

   // need to create a uid - string should be _id of user object, need to pull from database 
   let uid = 'some-uid';
   admin.auth().createCustomToken(uid)
      .then((customToken) => {
         // Send token back to client
         res.send(customToken);
      })
      .then(() => {
         next()
      })
      .catch((error) => {
         console.log('Error creating custom token:', error);
      });

   /*
   if (req.headers.authtoken) {
      admin.auth().verifyIdToken(req.headers.authtoken)
      .then( () => {
         next() // move on to the next part of the app
      }).catch( () => {
         res.status(403).send('user is unauthorized')
      });
   } else {
      res.status(403).send('authtoken doesn\'t exist');
   }
   */
}

router.use('/login', checkAuth);

router.get('/login', (req, res) => {

   const idToken = req.body.idToken.toString();

   // expiration time of the cookie. # of seconds * # of minutes * # of hours * # of days wanted * 1000 (it is in milliseconds)
   const expiresIn = 60*60*24*5*1000;

   admin.auth().createSessionCookie(idToken, {expiresIn})
   .then( (sessionCookie) => {
      const options = {
         maxAge: expiresIn,
         httpOnly: true
      }

      console.log('sending cookie', sessionCookie);
      console.log('sending options object', options);
      
      res.cookie('session', sessionCookie, options)
      res.end(JSON.stringify({status: "success"}))
   },
   (error) => {
      res.status(401).send("UNAUTHORIZED REQUEST");
      // TODO - change logic to something that works for an api server
      res.redirect('/')
   })
   // send user id to save in state and use in future api requests
   res.send('auth endpoint');
});


module.exports = router;







// create tenant restaurant 
/*
router.post('/auth/ck', (req, res) => {
   // create a new tenant for ck's grill
   const newTenant = db.Restaurant({
      adminName: "Kendra Flaum Pieratt",
      adminEmail: "kendraf1@cox.net",
      adminTel: "6027575283",
      menus: [],
      name: 'CK\'s Tavern & Grill',
      streetAddress: '4142 E. Chandler Blvd.',
      city: 'Phoenix',
      state: 'Arizona',
      zip: '85048'
   });

   newTenant.save()
      .then(result => {
         console.log('successfuly saved the below item to the database');
         console.log('================================================');
         console.log(result);
         console.log('================================================');
         console.log();
         res.send(result);
      })
      .catch(err => {
         console.log('There was an error saving the item to the database');
         console.log('================================================');
         console.log(err);
         console.log('================================================');
         console.log();
         res.send(err);
      });
});

router.post('/auth/espo', (req, res) => {
   // create a new tenant for ck's grill
   const newTenant = db.Restaurant({
      adminName: "someone",
      adminEmail: "some@thing.com",
      adminTel: "+12345678910",
      restaurantTel: '4805887377',
      menus: ['5ec76208d3e537098dd4f679'],
      name: 'Espo\'s Mexican Food',
      streetAddress: '3867 W Chandler Blvd',
      city: ', Chandler',
      state: 'Arizona',
      zip: '85226'
   });

   newTenant.save()
      .then(result => {
         console.log('successfuly saved the below item to the database');
         console.log('================================================');
         console.log(result);
         console.log('================================================');
         console.log();
         res.send(result);
      })
      .catch(err => {
         console.log('There was an error saving the item to the database');
         console.log('================================================');
         console.log(err);
         console.log('================================================');
         console.log();
         res.send(err);
      });
});
*/