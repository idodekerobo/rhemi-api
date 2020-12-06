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
       CATEGORIES
==============================
*/

// TODO -  '5fcd2dc7b24fd91faa32a979' // add basket of fries to appetizers

// grabbing all categories
router.get('/category', (req, res) => {
   db.Category.find()
      .populate('items')
      .exec()
      .then((categories) => {
         res.send(categories);
      })
      .catch((err) => {
         mongoDbErrorHandling(err);
      });
});

// grabbing a specific category (maybe to show menu items)
router.get('/category/:categoryid', (req, res) => {
   const categoryId = req.params.categoryid;
   db.Category.findById(categoryId).populate('categoryItems').exec((err, category) => {
      if (err) {
         mongoDbErrorHandling(err);
      }
      console.log('Found that category!');
      console.log(category);
      console.log();

      let itemStr = '';
      let length = category.categoryItems.length;
      category.categoryItems.forEach( (category, i) => {
         if (i === length-1) {
            itemStr += category.name;
         } else if (i === length-2) {
            itemStr += category.name + ' and ';
         } else {
            itemStr += category.name + ', ';
         }         
      });

      return res.send('This is the category: ' + category.name + '. These are the items: ' + itemStr);
   });
});

// adding a category, pushing an item into a cateogry arr
router.post('/category', (req, res) => {

   // categoryItems is an arr in req.body.categoryItems
   let newCategory = new db.Category(req.body);

   newCategory.save()
      .then(result => {
         console.log('successfuly saved the below category to the database');
         console.log('================================================');
         console.log(result);
         console.log('================================================');
         console.log();
         res.send(result);
      })
      .catch(err => {
         mongoDbErrorHandling(err);
      });
});

// updating a category
router.put('/category/:categoryid', (req, res) => {
   const categoryId = req.params.categoryid;

   // just setting to req.body ensures that what isn't specified isn't overwritten as null
   let updatedCategory = req.body;
   
   db.Category.findByIdAndUpdate(categoryId, updatedCategory, { new: true }, (err, updatedCategory) => {
      if (err) {
         mongoDbErrorHandling(err);
      }
      console.log('The category was successfuly updated, see below for the category.');
      console.log(updatedCategory)
      console.log('========================')
      console.log();
      return res.send('This is the category: ', updatedCategory, '. These are the items: ', updatedCategory.items);
   });
});
module.exports = router;