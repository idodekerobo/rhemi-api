const mongoose = require('mongoose');
const ItemAddOnSchema = new mongoose.Schema({
   name: {
      type: String,
      required: 'Add-on must have a name.'
   },
   price: {
      type: Number,
   },
   inStock: {
      type: Boolean,
      default: true,
   }
})

const ItemAddOn = mongoose.model('ItemAddOn', ItemAddOnSchema);
module.exports = ItemAddOn;