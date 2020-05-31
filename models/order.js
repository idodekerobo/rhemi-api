// ORDER SCHEMA
var mongoose = require('mongoose');
var OrderSchema = new mongoose.Schema({
    // schema automatically gets a _id w/ type ObjectID
    orderPlacedDate: {
        type: Date,
        default: Date.now()
    },
    customer: {
        type: String, // will be objectID of customer once that's up and running
        required: 'Order needs a name!'
    },
    orderItems: {
        type: [mongoose.Schema.Types.ObjectId], // arr of id's from menu/food items
        required: 'Order cannot be blank!'
    },
    cost: {
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