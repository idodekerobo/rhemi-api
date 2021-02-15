// RESTAURANTS SCHEMA
const mongoose = require('mongoose');

// Restaurant Schema will consolidate each model and represent all the data for one restauarant object
const restaurantSchema = new mongoose.Schema({
   adminName: {
      type: String,
      required: "Who is running this restaurant account?"
   },
   adminEmail: {
      type: String,
      required: "What is the email of the person running this restaurant account?"
   },
   adminTel: {
      type: String,
      required: "What is the phone number of the person running this restaurant account?"
   },
   restaurantTel: {
      type: String,
      // required: "How can customers contact the restaurant?"
   },
   menus: {
      type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Menu'}]
   },
   name: {
      type: String,
      required: "What is the restaurant name"
   },
   customers: {
      type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Customer'}]
   },
   orders: {
      type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}]
   },
   pushNotifTokens: {
      type: [String]
   },
   // pushNotifTokens: [
   //    {
   //       name: String,
   //       token: String,
   //    }
   // ],
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
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;