const express = require('express');
const router = express.Router();

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
const TAX_RATE = 0.1;
const calculateOrderAmount = (items) => {
   const subtotal = items.slice().reduce((acc, obj) => (acc += obj.price), 0).toFixed(2);
   const tax = (subtotal * TAX_RATE).toFixed(2);
   const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

   const price = {
      subtotal,
      tax,
      total
   }
   // return (subtotal*100);
   // return ((total*100).toFixed(0)); // returning the total w/ sales tax. fixing to 0 because we only need the two decimal points
   return price;
}

/*
==============================
            RESTAURANT INFO
==============================
*/
router.get('/', (req, res) => {
   db.Restaurant.find()
   .then( (restaurant) => {
      res.send(restaurant);
   })
   .catch((err) => {
      mongoDbErrorHandling(err);
   })
})

router.post('/restaurant', (req, res) => {

});

/*
==============================
            ORDER
==============================
*/

// getting all orders from database
router.get('/order', (req, res) => {
   db.Order.find()
   .populate('orderItems')
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
   var orderId = req.params.orderid;

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
router.post('/order', (req, res) => {

   const priceObj = calculateOrderAmount(req.body.items);

   // pickedUp and ready fields are created by default
   const order = new db.Order({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      city: req.body.city,
      state: req.body.customerState,
      zip: req.body.zip,
      orderItems: req.body.items, // WILL GRAB OBJECT ID'S OF SELECTED MENU ITEMS
      paid: req.body.paid,
      subtotal: priceObj.subtotal, // sum the total cost of items have to look up how to make sure these get counted as currency so no issues w/ decimals
      tax: priceObj.tax, // whatever the tax rate is
      totalCost: priceObj.total,
   });

   order
      .save()
      .then(result => {
         console.log('Latest order saved to database');
         console.log(result);
      })
      .catch(err => {
         mongoDbErrorHandling(err);
      });
   // res.redirect( [redirect page]);
   res.send('client side response: order has been saved to the database');
});

// update/change order - change to completed or update items on order
router.put('/order/:orderid', (req, res) => {
   var orderId = {
      _id: req.params.orderid
   }

   // MAYBE THINK ABUT NOT ALLOWING UPDATES/CHANGES IF ORDER IS ALREADY SHOWN TO BE COMPLETE
   let updatedOrder = {
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
   var orderId = req.params.orderid;

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