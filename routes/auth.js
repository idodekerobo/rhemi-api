require('dotenv').config();
const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");

// EVERY URL STARTS WITH /API/

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
// const db = require('../models/index');


// function mongoDbErrorHandling(err) {
//    console.log();
//    console.log('There was an error on the node server!');
//    console.log(err);
//    console.log();
//    // return res.send(err);
//    return res.send(500, { error: err });
// }

// MIDDLEWARE TO GET THE AUTH TOKEN FROM THE HEADER
const getAuthToken = (req, res, next) => {
   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      req.authToken = req.headers.authorization.split(' ')[1];
   } else {
      req.authToken = null;
   }
   next();
}

// MIDDLEWARE TO VERIFY AUTH TOKEN W/ FIREBASE, USES getAuthToken() MIDDLEWARE
const checkIfAuthorized = (req, res, next) => {
   getAuthToken(req, res, async () => {
      try {
         const { authToken } = req;
         admin.auth().verifyIdToken(authToken)
         .then((decodedToken) => {
            req.user = decodedToken;
            next();
            return;
         })
         .catch(e => {
            console.log(`there was an error verifying token w/ firebase`)
            console.log(e);
            const authObject = {
               authStatus: 'not authorized'
            }
            return res.status(401).send(authObject);   
         })
      } catch (e) {
         console.log(`error.code ${e.code}`)
         console.log(`error msg ${e.message}`);
         console.log(`full error ${e}`)
         const authObject = {
            authStatus: 'not authorized'
         }
         return res.status(401).send(authObject);
      }
   });
};

router.get('/auth', checkIfAuthorized, (req, res) => {
   // console.log(`========================================================`)
   // console.log(`authorized`)
   const authObject = {
      authStatus: 'authorized'
   }
   res.json(authObject);
})

module.exports = router;


// create tenant restaurant 
/*

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