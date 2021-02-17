require('dotenv').config();
const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");
const { default: Expo } = require('expo-server-sdk');
const expo = new Expo();

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
const db = require('../models/index');


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

/*
============================================================
                        EXPO PUSH TOKENS
============================================================
*/

const handlePushTokens = ({title, body}) => {
   let notifications = [ ];
   for (let pushToken of savedPushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
         console.error(`Push token ${pushToken} is not a valid Expo push token`);
         continue;
      }

      notifications.push({
         to: pushToken,
         sound: 'default',
         title,
         body,
         data: { body }
      });
   }

   let chunks = expo.chunkPushNotifications(notifications);

   (async () => {
      for (let chunk of chunks) {
         try {
            let receipts = await expo.sendPushNotificationsAsync(chunk);
            console.log(`these are the receipts ${receipts}`);
         } catch (error) {
            console.error(error);
         }
      }
   })();
};

let savedPushTokens = [ ];
const saveToken = token => {
   // console.log(`here is the token ${token} and here is the saved push tokens ${savedPushTokens}`);
   const exists = savedPushTokens.find(t => t === token);
   if (!exists) {
      savedPushTokens.push(token); // if it doesn't alrady exist, save push token to an array
      // TODO - need to find somewhere to keep push tokens???? it's not saving them currently
   } else {
      console.log(`push token already exists`);
   }
};

/*
============================================================
                        CHECK AUTH ROUTES
============================================================
*/

router.get('/auth', checkIfAuthorized, (req, res) => {
   // console.log(`========================================================`)
   // console.log(`authorized`)
   const authObject = {
      authStatus: 'authorized'
   }
   res.json(authObject);
})

/*
============================================================
                        SIGN IN/SIGN OUT
============================================================
*/

// getting push notif token from device
router.post('/saveToken', (req, res) => {
   
   // 1) when signining in is complete on client, send the uid to the server 
   // when user signs in, find their user object using uuid from firebase (????????)
   // console.log(`this is the body object ${JSON.stringify(req.body)}`)
   const uuid = req.body.uuid;
   const deviceTokenObject = req.body.clientToken.value; // this is the expo push token syntax: {type: 'expo', data: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]'}
   const deviceToken = deviceTokenObject.data; 
   

   // 2) take that uid and find mongodb user that ties to that on firebaseUid property
   // const signedInUser = await db.User.findOne({ 'firebaseUid': uuid } )
   db.User.findOne({ 'firebaseUid': uuid })
   .then(user => {
      // console.log(`the user object returned from querying on uuid sent to server ${user}`);
      // 3) based on that user object return the restaurant _id they're associated with
      let restaurantId = user.restaurant

      // 4) check to see if this device token is present in that restaurant's pushNotifTokens field
      db.Restaurant.findOne({ '_id': restaurantId })
      .then(restaurant => {
         // console.log(`the restaurant object returned from querying on _id inside user object ${restaurant}`);
         let restaurantDevices = [...restaurant.pushNotifTokens];
         
         // 4a) if it doesn't include the deviceToken add that token to that array
         if (!restaurantDevices.includes(deviceToken)) {
            // console.log(`restaurant device arr: (${restaurantDevices}) doesn't have the signed in device push token: ${deviceToken}`);
            restaurantDevices.push(deviceToken)
            db.Restaurant.findOneAndUpdate({ '_id': restaurantId }, {$set: {pushNotifTokens: restaurantDevices} }, {new: true})
            .then(newRestaurantObj => {
               // console.log(`this is the new restaurantObject w/ the updated device token array ${newRestaurantObj}`);
            })
            .catch(err => {
               console.log(`There was an error updating the restaurant object w/ the new device token array ${err}`);
            });      
         } else {
            console.log(`The restaurant devices array includes the deviceToken:  ${restaurantDevices}`);
         }

      })
      .catch(err => {
         console.log(`There was an error trying to find the restaurant based on the user's listed restaurant _id string ${err}`);
      });
   })
   .catch(err => {
      console.log(`There was an error looking for this user on the database: ${err}`);
   })

   // TODO - determine if this saveToken function is needed.....
   saveToken(req.body.clientToken.value); 

   // TODO - think about whether i should conditionally send shit back to the server
   // send back restaurant id to be saved in async storage/context
   res.send(`Received push token on the server`);
});

router.post('/signout', async (req, res) => {
   // remove push notif token from the database
   const restaurantId = req.body.clientToken.restaurantId;
   const deviceTokenObject = req.body.clientToken.value;
   const deviceToken = deviceTokenObject.data;
   let currentTokenArr;
   let newTokenArr;
   let index; 
   console.log('==================================================');
   console.log();
   console.log(JSON.stringify(deviceToken));
   
   try {
      let restaurantObj = await db.Restaurant.findById(restaurantId);
      console.log(`returned restaurantObj: ${restaurantObj}`);
      currentTokenArr = restaurantObj.pushNotifTokens;
      newTokenArr = [...currentTokenArr];
      index = newTokenArr.indexOf(deviceToken);
      
      // may need to work in functionality of some type of do...while loop if there are multiple copies of the same token
      if (index > -1) {
         newTokenArr.splice(index, 1)
         console.log();
         console.log(`removed device token from the array here is newTokenArr ${newTokenArr}`);
         console.log(`this is the restaurantObj.pushNotifTokens ${restaurantObj.pushNotifTokens}`);
      } else {
         console.log(`this token is not present in the restaurant object ${deviceToken}`);
      }

      try {
         const query = {_id: restaurantId};
         let newRestaurantObj = await db.Restaurant.findOneAndUpdate(query, {$set: {pushNotifTokens: newTokenArr}}, {new: true});
         console.log(`This is the new restaurant object w/ the device token: ${deviceToken} removed: ${newRestaurantObj}`);
      } catch (e) {
         console.log(`There was an error sending the new array back to the database ${e}`)
      }

   } catch (e) {
      console.log(`There was an error grabbing the restaurant object from the database ${e}`)
   }
});

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