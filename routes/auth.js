const express = require('express');
const router = express.Router();
const admin = require('../services/firebase');

// const config = require('../services/firebase');
// const admin = require('firebase-admin');
// admin.initializeApp(config);

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

// get auth token middleware
const getAuthToken = (req, res, next) => {
   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      req.authToken = req.headers.authorization.split(' ')[1];
   } else {
      req.authToken = null;
   }
   next();
}
const checkIfAuthorized = (req, res, next) => {
   getAuthToken(req, res, async () => {
      try {
         const { authToken } = req;
         admin.auth().verifyIdToken(authToken)
         .then((decodedToken) => {
            console.log(`id token correct decoded ${decodedToken}`)
            req.user = decodedToken;
            next();
            return;
         })
         // .catch(err => {
         //    console.log(err);
         // })
      } catch (e) {
         console.log(`error.code ${e.code}`)
         console.log(`error msg ${e.message}`);
         console.log(`full error ${e}`)
         return res.status(401).send({error: 'You are not authorized to make this request'});
      }
   });
};

// router.use('/login', checkAuth);

// router.post('/auth', (req, res) => {
router.get('/auth', checkIfAuthorized, (req, res) => {
   console.log();
   console.log(`========================================================`)
   console.log(`this is the request: ${req}`)

   console.log();
   console.log(`========================================================`)
   console.log(`this is the response: ${res}`);

   console.log();
   console.log(`========================================================`)
   console.log(`user is authenticated - this is the response`)

   res.send(`user is authenticated - this is the response`);
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