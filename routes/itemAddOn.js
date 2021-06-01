const express = require('express');
const router = express.Router();

/*
///////////// NOT EXPORTING THESE ROUTES, NOT USING ITEM ADD ON SCHEMA /////////////
*/

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
=====================================
            ITEM ADD ONS
=====================================
*/

router.get('/itemaddons', (req, res) => {
   db.ItemAddOn.find()
      .then((itemAddOns) => {
         res.send(itemAddOns);
      })
      .catch((err) => {
         mongoDbErrorHandling(err);
      })
});

router.post('/itemaddons', (req, res) => {

   const newAddOn = new db.ItemAddOn({
      name: req.body.name,
      price: req.body.price,
      required: req.body.required,
      inStock: req.body.inStock,
   });

   newAddOn.save()
   .then(result => {
   // console.log('successfuly saved the below item to the database');
      // console.log('================================================');
      // console.log(result);
      // console.log('================================================');
      // console.log();
      res.send(result);
   })
   .catch(err => {
      // console.log('There was an error saving the item to the database');
      // console.log('================================================');
      // console.log(err);
      // console.log('================================================');
      // console.log();
      res.send(err);
   });
});

// NOT EXPORTING THESE ROUTES. WILL BUILD THIS FEATURE OUT LATER
// module.exports = router;