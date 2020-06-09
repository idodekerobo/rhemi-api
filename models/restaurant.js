// RESTAURANTS SCHEMA
var mongoose = require('mongoose');

// Restaurant Schema will consolidate each model and represent all the data for one restauarant object
var restaurantSchema = new mongoose.Schema({
   // menu's
   menus: {
      type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Menu'}]
   },
   name: {
      type: String,
      required: "What is the restaurant name"
   },
   // address
   streetAddress: {
      type: String
   },
   city: {
      type: String 
   },
   state: {
      type: String
   },
   zip: {
      type: String
   }
   // customers

   // orders
});

var Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;