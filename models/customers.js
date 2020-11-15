// CUSTOMER SCHEMA
var mongoose = require('mongoose');
var CustomerSchema = new mongoose.Schema({
   firstName: {
      type: String,
      trim: true,
      required: 'Please fill out your first name!'
   },
   lastName: {
      type: String,
      trim: true,
      required: 'Please fill out your last name!'
   },
   email: {
      type: String,
      required: 'Please put a valid email address.'
   },
   numOrders: {
      type: Number,
      default: 0
   },
   orders: {
      type: Array // change to arr of order ID's if possible
   },
   restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: 'Each customer has to be mapped to a restaurant.'
   }
});

var Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;