// module.exports.Item = require('./item');
// CATEGORIES OF FODO
var mongoose = require('mongoose');
var categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Category has to have a type i.e., Beverages or Desserts'
    },
    categoryItems: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]
});

var Category = mongoose.model('Category', categorySchema);
module.exports = Category;