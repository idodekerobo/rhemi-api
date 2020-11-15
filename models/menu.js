// MENU SCHEMA
var mongoose = require('mongoose');
var MenuSchema = new mongoose.Schema({
   name: {
      type: String,
      required: "Menu has to have a name, i.e, Leo's Coney Island's Menu"
   },
   restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: 'Each menu has to be mapped to a restaurant.'
   },
   menuCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
   menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});

var Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;