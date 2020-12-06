// module.exports.Item = require('./item');
// CATEGORIES OF FODO
const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
   name: {
      type: String,
      required: 'Category has to have a type i.e., Beverages or Desserts'
   },
   categoryItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
   restaurantId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Restaurant',
      required: 'Each category has to be mapped to a restaurant.'
   }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;