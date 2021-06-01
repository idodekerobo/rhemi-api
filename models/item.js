// CUSTOMER SCHEMA
const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
   name: {
      type: String,
      required: 'Item must have a name.'
   },
   price: {
      type: Number,
      required: 'Item must have a price.'
   },
   description: {
      type: String
   },
   options: [{
      name: String, // type of option, e.g., "Meat" or "Salsa"
      chooseNum: Number, // the amount you can choose for this. if 1 you can only choose one. if -1 you can choose as many as you like
      availChoices: [{name: String, price: Number, selected: {type: Boolean, default: false} }], // the type of choices, each having a name, price (for price adder), and selected (boolean) key. e.g. if this is Meat then the availChioces will be [ {name: "Steak", price: 1, selected: false}, {name: "Chicken", price: 0, selected: false}, {name: "Shrimp", price: 2, selected: false}]
   }],
   config: { }, // config.kind.sides.choices to get the sides available or config.drinks.choices to get drinks avail
   // THIS SCHEMA IS NOT BEING USED RIGHT NOW
   // availableAddOns: {
   //    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'ItemAddOn'}],
   // },
   selectedAddOns: [{ }],
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