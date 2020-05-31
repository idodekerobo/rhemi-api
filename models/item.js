// CUSTOMER SCHEMA
var mongoose = require('mongoose');
var ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Item must have a name.'
    },
    price: {
        type: Number,
        required: 'Item must have a price.'
    },
    inStock:{
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
    }
});

var Item = mongoose.model('Item', ItemSchema);
module.exports = Item;