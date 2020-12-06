const express = require('express');
const router = express.Router();

// Require database in router
const db = require('../models/index');

// EVERY URL STARTS WITH /API/

function mongoDbErrorHandling(err) {
   console.log();
   console.log('================================================');
   console.log('There was an error!');
   console.log(err);
   console.log('================================================');
   console.log();
   return res.send(500, { error: err });
}

/*
=================================
            RESTAURANT
=================================
*/

// getting all restaurants
router.get('/restaurant', (req, res) => {
   db.Restaurant.find()
      .then((restaurant) => {
         res.send(restaurant);
      })
      .catch((err) => {
         mongoDbErrorHandling(err);
      })
});

router.post('/newRestaurant', (req, res) => {
   const newRestaurant = new db.Restaurant({
      adminName: req.body.adminName,
      adminEmail: req.body.adminEmail,
      adminTel: req.body.adminTel,
      restaurantTel: req.body.restaurantTel,
      name: req.body.restaurantName,
      streetAddress: req.body.streetAddress,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip
   });

   newRestaurant.save()
   .then(result => {
      console.log('successfuly saved the below item to the database');
      console.log('================================================');
      console.log(result);
      console.log('================================================');
      console.log();
      res.send(result);
   })
   .catch(err => mongoDbErrorHandling(err));
});

module.exports = router;