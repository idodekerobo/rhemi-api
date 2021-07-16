const express = require('express');
const router = express.Router();
const functions = require('../services/functions');
const { default: Expo } = require('expo-server-sdk');
const expo = new Expo();

// Require database in router
const db = require('../models/index');

// EVERY URL STARTS WITH /API/

function mongoDbErrorHandling(err) {
   console.log();
   console.log('There was an error on the node server!');
   console.log(err);
   console.log();
   return res.send(500, { error: err });
}

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
==============================
            ORDER
==============================
*/

// getting all orders from database
router.get('/order', (req, res) => {
   // router.get('/order', checkIfAuthorized, (req, res) => {
   db.Order.find()
   .exec()
   .then((orders) => {
      res.send(orders);
   })
   .catch((err) => {
      res.send(err);
   });
});

// get a specific order
router.get('/order/:orderid', (req, res) => {
   const orderId = req.params.orderid;

   db.Order.findById(orderId, (err, order) => {
      if (err) {
         mongoDbErrorHandling(err);
      }
      console.log('Found that order!');
      console.log(order);
      console.log();
      return res.send(order);
   });
});

// sending order to database
router.post('/order', async (req, res) => {
   const priceObj = functions.calculateOrderAmount(req.body.items);

   // TODO - need to map EACH ORDER TO A RESTAURANT
   let restaurantId;
   if (req.body.items[0]) restaurantId = req.body.items[0].restaurantId;

   // pickedUp and ready fields are created by default
   // TODO - order doesn't have config object in it??? but it is in the cart that is being sent on the fetch
   const order = new db.Order({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      city: req.body.city,
      state: req.body.customerState,
      zip: req.body.zip,
      orderItems: req.body.items, // WILL GRAB OBJECT ID'S OF SELECTED MENU ITEMS
      restaurantId: restaurantId, // TODO - find a better way to do this
      paid: req.body.paid,
      subtotal: priceObj.subtotal, // sum the total cost of items have to look up how to make sure these get counted as currency so no issues w/ decimals
      tax: priceObj.tax, // whatever the tax rate is
      totalCost: priceObj.total,
   });

   let savedOrder;
   try {
      savedOrder = await order.save();
   } catch (e) {
      mongoDbErrorHandling(e)
   }

   // taking order and sending notification to the restaurant's devices
   // grab token from restaurant object
   db.Restaurant.findById(restaurantId)
   .exec()
   .then(restaurantObj => {
      const tokenArr = restaurantObj.pushNotifTokens;

      // only run this if any token arrs are present
      if (tokenArr.length > 0) {
         // https://github.com/expo/expo-server-sdk-node
         let messages = [];
         // execute for each token in the tokenArr returned
         console.log('token arr')
         console.log(tokenArr)
         for (token of tokenArr) {
            let newMsg = {
               to: token,
               sound: 'default',
               title: `A new order came in from ${req.body.firstName}!`,
               subtitle: 'Go to the Rhemi app to see!',
               data: { // max payload size is 4KB
                  _id: savedOrder._id,
                  firstName: savedOrder.firstName,
                  lastName: savedOrder.lastName,
               }
            }
            messages.push(newMsg);
         }

         // SEND PUSH NOTIF THAT AN ORDER CAME IN
         let chunks = expo.chunkPushNotifications(messages);
         let tickets = [];
         (async () => {
            // send chunks to the expo push notif service
            for (let chunk of chunks) {
               try {
                  let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                  console.log(`this is the ticket chunk`)
                  console.log(ticketChunk)
                  tickets.push(...ticketChunk);
               } catch (e) {
                  // TODO - need to handle errors appropriately
                  // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                  console.log(`error from ticket chunking ${e}`);
               }
            }
         })();
      }
   })
   .catch(err => {
      console.log(`there was an error getting the restauarant push tokens ${err}`);
   })

   // res.redirect( [redirect page]);
   res.send('client side response: order has been saved to the database');
});

// update/change order - change to completed or update items on order
router.put('/order/:orderid', (req, res) => {
   const orderId = {
      _id: req.params.orderid
   }

   // MAYBE THINK ABUT NOT ALLOWING UPDATES/CHANGES IF ORDER IS ALREADY SHOWN TO BE COMPLETE
   let updatedOrder = {
      entered: req.body.entered,
      ready: req.body.ready,
      paid: req.body.paid,
      pickedUp: req.body.pickedUp,
      // can use to update other order fields
   }

   if (updatedOrder.pickedUp) {
      updatedOrder.orderFinishedDate = Date.now();
   }

   db.Order.findOneAndUpdate(orderId, updatedOrder, { new: true }, (err, order) => {
      if (err) {
         mongoDbErrorHandling(err);
      }
      console.log('The order was successfuly updated on the node server, see below for the order');
      console.log(order)
      console.log('========================')
      console.log();
      return res.send(order);
   });
});

// delete an order
router.delete('/order/:orderid', (req, res) => {
   const orderId = req.params.orderid;

   db.Order.findByIdAndDelete(orderId, (err, deletedOrder) => {
      if (err) {
         mongoDbErrorHandling(err);
      }
      console.log('The order was deleted! See below for the item');
      console.log(deletedOrder);
      return res.send('The order was deleted!');
   })
})

module.exports = router;