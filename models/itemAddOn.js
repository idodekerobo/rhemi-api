const mongoose = require('mongoose');
/*
///////////// NOT USING THIS MODEL, BUT WHEN I DON'T EXPORT IT I CAN'T GRAB THE MENU /////////////
*/
const ItemAddOnSchema = new mongoose.Schema({
   name: {
      type: String,
      required: 'Add-on must have a name.'
   },
   price: {
      type: Number,
      required: 'Price is required, if free put 0.00.',
   },
   addOnType: {
      type: String,
   },
   required: {
      type: Boolean,
      default: false,
   },
   inStock: {
      type: Boolean,
      default: true,
   }
})

const ItemAddOn = mongoose.model('ItemAddOn', ItemAddOnSchema);
module.exports = ItemAddOn;