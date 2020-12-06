// CUSTOMER SCHEMA
const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
   name: {
      type: String,
      required: 'Item must have a name.'
   },
   // TODO - think about how to manage prices for different sizes?? or just make two separate items?
   // TODO - add object array for item add ons
   price: {
      type: Number,
      required: 'Item must have a price.'
   },
   description: {
      type: String
   },
   availableAddOns: {
      type: [{type: mongoose.Schema.Types.ObjectId, ref: 'ItemAddOn'}],
   },
   selectedAddOns: {
      type: [{type: mongoose.Schema.Types.ObjectId, ref: 'ItemAddOn'}],
   },
   size: {
      type: String
   },
   inStock: {
      type: Boolean,
      default: true
   },
   onSale: {
      type: Boolean,
      default: false
   },
   discount: {
      type: Number,
      default: 0
   },
   restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: 'Each item has to be mapped to a restaurant.'
   }
});

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;