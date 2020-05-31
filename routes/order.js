const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

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
            MENU
==============================
*/
// get all menu's
router.get('/menu', (req, res) => {
   db.Menu.find().populate('menuCategories')
   // populating the Item model reference inside the menuCategories object
   .populate({
      path: 'menuCategories',
      populate: {
         path: 'categoryItems',
         model: 'Item'
      }
   })
   .populate('menuItems')
   .exec()
   .then((menu) => {
      res.send(menu);
   })
   .catch((err) => {
      res.send(err);
   });
});

// post a new menu
router.post('/menu', (req, res) => {
   console.log('body of request: ', req.body);
   let itemArr = [];
   itemArr.push(req.body.item1, req.body.item2);
   // itemArr.push('5e951647d7124410240348ff', '5ea4f0819a2fa20c3c52d6da');

   let categoryArr = [];
   categoryArr.push(req.body.category1);
   // categoryArr.push('5ea6415254dbd51346d9497b');

   const newMenu = new db.Menu({
      name: req.body.name,
      menuItems: itemArr,
      menuCategories: categoryArr
   });
   
   // const newMenu = new db.Menu({
   //    name: 
   // })

   newMenu.save()
   .then(result => {
      console.log(result);
      res.send(result);
   })
   .catch(err => {
      console.log(err);
      res.send(err);
   });

   console.log('new menu object ', newMenu);
});

// get a specific menu
router.get('/menu/:menuId', (req, res) => {
   var menuId = req.params.menuId;
   db.Menu.findById(menuId).populate('menuCategories').populate('menuItems').exec( (err, menu) => {
      if (err) {
         mongoDbErrorHandling(err);
      }
      console.log('This is the menu!');
      console.log(menu);
      return res.send(menu);
   });
});

// db.Category.findById(categoryId).populate('categoryItems').exec((err, category) => {
// get all categories of a menu
router.get('/menu/:menuId/category', (req, res) => {
   var menuId = req.params.menuId;
   db.Menu.findById(menuId).populate('menuCategories').exec( (err, menu) => {
      if (err) {
         mongoDbErrorHandling(err);
      }
      console.log('This is the arr of categories in the menu');
      console.log(menu.menuCategories);
      return res.send(menu.menuCategories);
   });
});

// get a specific category of a menu 
router.get('/menu/:menuId/category/:categoryId', (req, res) => {
   var menuId = req.params.menuId;
   var categoryId = req.params.categoryId;
   db.Menu.findById(menuId).populate('menuCategories').exec( (err, menu) => {
      if (err) {
         mongoDbErrorHandling(err);
      }
      
      const categoryArr = menu.menuCategories;
      // const category = categoryArr.filter( (category) => category._id == categoryId);

      const category = categoryArr.find( (category) => category._id == categoryId );

      console.log(category);
      return res.send(category);
   });
});


// updating a menu 
router.put('/menu/:menuId', (req, res) => {
   var menuId = req.params.menuId;

   const updatedMenu = req.body;

   db.Menu.findOneAndUpdate(
      menuId,
      updatedMenu,
      { new: true },
      (err, updatedMenu) => {
         if (err) {
            mongoDbErrorHandling(err);
         }
         console.log('Updating menu was successful.');
         console.log(updatedMenu);
         return res.send('Successfully updated.');
      }
   );
})

/*
==============================
            ITEMS
==============================
*/

// getting all menu items
router.get('/items', (req, res) => {
   db.Item.find()
      .then((items) => {
         res.send(items);
      })
      .catch((err) => {
         mongoDbErrorHandling(err);
      })
});

// getting one specific item
router.get('/items/:itemid', (req, res) => {
   var itemId = req.params.itemid;
   db.Item.findById(itemId, (err, item) => {
      if (err) {
         mongoDbErrorHandling(err);
      }
      console.log('Here\'s your item');
      console.log(item);
      console.log();
      return res.send(item);
   });
});

// posting a new item
router.post('/items', (req, res) => {

   const newItem = new db.Item({
      name: req.body.name,
      price: req.body.price,
      // inStock: null, // defaults to true
      // onSale: null, // defaults to false
      // discount: 0, // defaults to zero
   })

   newItem.save()
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

// updating an item
router.put('/items/:itemid', (req, res) => {
   // client side will take you to a url that has the id of the item to be updated
   var query = {
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
   var id = req.params.itemid;
   db.Item.findByIdAndDelete(id, (err, deletedItem) => {
      if (err) {
         mongoDbErrorHandling(err);
      }
      console.log('The item was deleted! See below for the item');
      console.log(deletedItem);
      res.send('Item was deleted!');
   });
})

/*
==============================
        MENU CATEGORIES
==============================
*/

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
   var categoryId = req.params.categoryid;
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

// adding to a category, pushing an item into a cateogry arr
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
   var categoryId = req.params.categoryid;

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
})

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