// import './credentials';
const mongoose = require('mongoose');

mongoose.set('debug', true); // allows us to see whats being sent to db
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true` by default, you need to set it to false.
mongoose.set('useFindAndModify', false); 

// const testDb =  process.env.MONGO_DB_TEST_CONN;
const prodDb = process.env.MONGO_DB_PROD_CONN;
// mongoose.connect(testDb, {
mongoose.connect(prodDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB Server is connected"))
  .catch(err => console.log('Database has failed to connect. Here\'s the error: ', err));

module.exports.Customer = require('./customer');
module.exports.Item = require('./item');
module.exports.ItemAddOn = require('./itemAddOn');
module.exports.Menu = require('./menu');
module.exports.Order = require('./order');
module.exports.Category = require('./category');
module.exports.User = require('./user');
module.exports.Restaurant = require('./restaurant');