// ORDER SCHEMA
var mongoose = require('mongoose');
var OrderSchema = new mongoose.Schema({
   // schema automatically gets a _id w/ type ObjectID
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
      type: [mongoose.Schema.Types.ObjectId], // arr of id's from menu/food items
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
   completed: {
      type: Boolean,
      default: false
   },
   orderFinishedDate: {
      type: Date
   }
});

var Order = mongoose.model('Order', OrderSchema);
module.exports = Order;