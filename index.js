const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY)
const app = express();
const PORT = process.env.PORT;

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Require Routes 
const orderRoutes = require('./routes/order.js');
const menuRoutes = require('./routes/menu.js');
const categoryRoutes = require('./routes/category.js');
const itemRoutes = require('./routes/item.js');
const checkoutRoutes = require('./routes/checkout.js');

// Building Proxy Server for CORS Error requesting api from front-end
  // https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
app.use( (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  next();
});

// tell app to use the api routes
app.use('/api', orderRoutes);
app.use('/api', menuRoutes);
app.use('/api', categoryRoutes);
app.use('/api', itemRoutes);
app.use('/api', checkoutRoutes);

app.get('/', (req, res) => {
  res.send('now we cookin');
});

// making server listen
app.listen(PORT, () => {
    console.log('Backend server is running on port', PORT);
});