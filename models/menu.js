// MENU SCHEMA
var mongoose = require('mongoose');
var MenuSchema = new mongoose.Schema({
   name: {
      type: String,
      required: "Menu has to have a name, i.e, Leo's Coney Island's Menu"
   },
   menuCategories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
   menuItems: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]
});

var Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;