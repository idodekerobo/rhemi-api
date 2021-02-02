// import './credentials';
const mongoose = require('mongoose');

mongoose.set('debug', true); // allows us to see whats being sent to db

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
module.exports.Restaurant = require('./restaurant');