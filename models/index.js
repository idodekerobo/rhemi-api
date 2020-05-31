// import './credentials';
const mongoose = require('mongoose');
const credentials = require('../credentials');
 
mongoose.set('debug', true); // allows us to see whats being sent to db

const db = credentials.MONGO_DB_CONN;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB Server is connected"))
  .catch(err => console.log('Database has failed to connect. Here\'s the error: ', err));

module.exports.Customer = require('./customers');
module.exports.Item = require('./item');
module.exports.Menu = require('./menu');
module.exports.Order = require('./order');
module.exports.Category = require('./category');
module.exports.Restaurant = require('./restaurant');