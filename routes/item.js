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
            ITEMS
==============================
*/

// getting all menu items
router.get('/items', (req, res) => {
   db.Item.find()
   // popoulating availableAddOns from the _id reference 
   .populate('availableAddOns')
   .exec()
   .then((items) => {
      res.send(items);
   })
   .catch((err) => {
      mongoDbErrorHandling(err);
   })
});

// getting one specific item
router.get('/items/:itemid', (req, res) => {
   const itemId = req.params.itemid;
   db.Item.findById(itemId)
   .populate('availableAddOns')
   .exec()
   .then(item => {
      res.send(item);
   })
   .catch(err => mongoDbErrorHandling(err));
});

// posting a new item
router.post('/items', (req, res) => {

   const newItem = new db.Item({
      name: req.body.name,
      price: req.body.price,
      restaurantId: req.body.restaurantId,
      description: req.body.description,
      // inStock: null, // defaults to true
      // onSale: null, // defaults to false
      // discount: 0, // defaults to zero
   })

   newItem.save()
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

// updating an item
router.put('/items/:itemid', (req, res) => {
   // client side will take you to a url that has the id of the item to be updated
   const query = {
      _id: req.params.itemid
   }
   const updatedItem = req.body; // just setting to req.body ensures that what isn't specified isn't overwritten as null

   // if this doesn't work can also use findByIdAndUpdate
   db.Item.findOneAndUpdate(
      query,
      updatedItem,
      { new: true },
      (err, updatedItem) => {
         if (err) {
            mongoDbErrorHandling(err);
         }
         console.log('Item was successfuly updated, see updated item below');
         console.log('============================');
         console.log(updatedItem);
         console.log('============================');
         console.log();
         return res.send('Successfuly saved');
      }
   );
});

// deleting an item
router.delete('/items/:itemid', (req, res) => {
   const id = req.params.itemid;
   db.Item.findByIdAndDelete(id, (err, deletedItem) => {
      if (err) {
         mongoDbErrorHandling(err);
      }
      console.log('The item was deleted! See below for the item');
      console.log(deletedItem);
      res.send('Item was deleted!');
   });
})

module.exports = router;