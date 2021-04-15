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
========================================
            EDIT MENU NAME
========================================
*/

router.post('/editMenuName', (req, res) => {
   const updates = req.body
   const { name } = req.body
   // console.log(req.body._id);
   
   db.Menu.findOneAndUpdate(
      { _id: req.body._id }, // if it doesn't find a doc w/ this query it'll return null
      updates, // not taking update object since it updates the _id, an un-needed db write
      // { name: name }, // not taking update object since it updates the _id, an un-needed db write
      // { $set: { name: name } },
      { new: true },
      (err, updatedMenu) => {
         if (err) {
            mongoDbErrorHandling(err);
         }
         console.log('Menu was successfuly updated, see updated item below');
         console.log('============================');
         console.log(updatedMenu);
         console.log('============================');
         console.log();
         return res.send('Successfuly saved');
      }
   );
});

router.post('/editCategory', (req, res) => {
   // const categoryId = req.body
   const updatedCategory = req.body;
   db.Category.findOneAndUpdate(
      { _id: req.body._id }, // if it doesn't find a doc w/ this query it'll return null
      updatedCategory, // does this cause un-needed re-writes of the database???
      // { name: name }, // not taking update object since it updates the _id, an un-needed db write
      // { $set: { name: name } },
      { new: true },
      (err, updatedCategory) => {
         if (err) {
            mongoDbErrorHandling(err);
         }
         console.log(`Category was successfully updated, see updated object below`);
         console.log('============================');
         console.log(updatedCategory);
         console.log('============================');
         console.log();
         return res.send('Successfuly saved');   
      }
   );
})

router.post('/editItemName', (req, res) => {
   const updatedItem = req.body;
   db.Item.findOneAndUpdate(
      { _id: req.body._id },
      updatedItem, // does this cause un-needed re-writes of the database???
      // { name: name }, // not taking update object since it updates the _id, an un-needed db write
      // { $set: { name: name } },
      { new: true },
      ( err, updatedItem ) => {
         if (err) {
            mongoDbErrorHandling(err);
         }
         console.log(`Item was successfully updated. See updated object below`);
         console.log('============================');
         console.log(updatedItem);
         console.log('============================');
         console.log();
         return res.send('Successfuly saved');   
      }
   );
});

router.post('/editItem', (req, res) => {
   const itemId = req.body.newItemObject._id;
   const updatedItemObj = req.body.newItemObject;

   db.Item.findOneAndUpdate(
      { _id: itemId },
      updatedItemObj,
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
   )
});

router.post('/editItemOptions', (req, res) => {
   const itemId = req.body.newItemObject._id;
   const updatedItemObj = req.body.newItemObject;

   console.log('updated item from client sent to backend')
   console.log(updatedItemObj)

   db.Item.findOneAndUpdate(
      { _id: itemId },
      updatedItemObj,
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
   )
});

module.exports = router;