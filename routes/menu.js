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
   const menuId = req.params.menuId;
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
   const menuId = req.params.menuId;
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
   const menuId = req.params.menuId;
   const categoryId = req.params.categoryId;
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
   const menuId = req.params.menuId;

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
});

// post ck menu
/*
router.post('/newCkMenu', (req, res) => {

   let categoryArr = [];
   async function getCategories() {
      let categories = await db.Category.find()
         .then((categories) => {
            categoryArr = categories;
            return categories;
         })
         .catch((err) => {
            mongoDbErrorHandling(err);
      });
   }
   
   let itemArr = [];
   async function getItems() {
      let items = await db.Item.find()
         .then((items) => {
            itemArr = items;
            return items;
         })
         .catch((err) => {
            mongoDbErrorHandling(err);
      });
   }

   function sendToDb() {
      const newMenu = new db.Menu({
         name: "CK's Menu",
         menuItems: itemArr,
         menuCategories: categoryArr,
         restaurantId: '5fcd290f26d1f71f24a1ce4c',
      });
   
      // console.log(newMenu);   
      newMenu.save()
      .then(result => {
         console.log('it worked');
         res.send(result);
      })
      .catch(err => {
         console.log(err);
         res.send(err);
      });
   }
   function err(err) {
      console.log(err);
   }

   // getCategories()
   // .then(getItems, err(err))
   // .then(sendToDb, err(err));
});
*/

module.exports = router;