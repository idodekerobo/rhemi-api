// ORDER SCHEMA
var mongoose = require('mongoose');
var OrderSchema = new mongoose.Schema({
   // schema automatically gets a _id w/ type ObjectID
   // TODO - figure out how to make this the date the order is sent to the server, not the date that the window session is open
   restaurantId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Restaurant',
      required: 'Each order has to be mapped to a restaurant.'
   },
   orderPlacedDate: {
      type: Date,
      default: Date.now()
   },
   firstName: {
      type: String,
      required: 'Order needs a name'
   },
   lastName: {
      type: String,
      required: 'Order needs a name'
   },
   email: {
      type: String,
      required: 'Order needs an email'
   },
   phone: {
      type: String,
      required: 'Order needs contact phone',
   },
   city: {
      type: String,
      required: 'customer city needed',
   },
   state: {
      type: String,
      required: 'customer state needed',
   },
   zip: {
      type: String,
      required: 'customer zip code',
   },
   orderItems: {
      type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}], // arr of id's from menu/food items
      required: 'Order cannot be blank!'
   },
   subtotal: {
      type: Number,
      required: 'Must have a subtotal price!'
   },
   tax: {
      type: Number,
      required: 'Must have tax assigned to it!'
   },
   totalCost: {
      type: Number,
      required: 'Must have a total price!'
   },
   ready: {
      type: Boolean,
      default: false,
      required: 'Need to know whether the order is ready or not.'
   },
   pickedUp: {
      type: Boolean,
      default: false,
      required: 'Need to know whether the order has been picked up or not.'
   },
   orderFinishedDate: {
      type: Date
   },
   paid: {
      type: Boolean,
      required: 'Need to know whether the order is paid or not.'
   }
});

var Order = mongoose.model('Order', OrderSchema);
module.exports = Order;