const express = require('express');
const router = express.Router();

// Require database in router
const db = require('../models/index');

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
   // putting the id's of items into an array
   // let items = [];
   // items.push
   var cost = Number(req.body.cost);
   var taxRate = .12
   var tax = cost * taxRate;
   var totalCost = cost + tax;
   const order = new db.Order({
      customer: req.body.name, // EVENTUALLY WILL BE OBJECT ID OF CUSTOMER
      orderItems: req.body.items, // WILL GRAB OBJECT ID'S OF SELECTED MENU ITEMS
      cost: 20, // sum the total cost of items have to look up how to make sure these get counted as currency so no issues w/ decimals
      tax, // whatever the tax rate is
      totalCost,
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
   res.send('thank you for the order!');
});

// update/change order - change to completed or update items on order
router.put('/order/:orderid', (req, res) => {
   var orderId = {
      _id: req.params.orderid
   }

   // MAYBE THINK ABUT NOT ALLOWING UPDATES/CHANGES IF ORDER IS ALREADY SHOWN TO BE COMPLETE
   // 
   let updatedOrder = {
      customer: req.body.name,
      orderItems: req.body.items,
      completed: req.body.completed
   }

   if (updatedOrder.completed) {
      updatedOrder.orderFinishedDate = Date.now();
   }

   db.Order.findOneAndUpdate(orderId, updatedOrder, { new: true }, (err, order) => {
      if (err) {
         mongoDbErrorHandling(err);
      }
      console.log('The order was successfuly updated, see below for the order');
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