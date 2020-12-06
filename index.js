const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
// const stripe = require("stripe")(process.env.STRIPE_TEST_KEY)
const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json({
   // adding middleware so can use raw body for webhook logic w/ stripe
   // stack overflow that helped: https://stackoverflow.com/questions/53899365/stripe-error-no-signatures-found-matching-the-expected-signature-for-payload
   verify: function(req, res, buf) {
      const url = req.originalUrl;
      if (url.startsWith('/api/onlineorders')) {
         req.rawBody = buf.toString();
      }
   }
}));
app.use(cookieParser()); // using cookie parser for authenticating cookies
app.use(bodyParser.urlencoded({extended: true}));

// Require Routes 
// TODO - require auth route here
const authRoutes = require('./routes/auth.js');
const orderRoutes = require('./routes/order.js');
const menuRoutes = require('./routes/menu.js');
const categoryRoutes = require('./routes/category.js');
const itemRoutes = require('./routes/item.js');
const checkoutRoutes = require('./routes/checkout.js');
const restaurantRoutes = require('./routes/restaurant.js');

// Building Proxy Server for CORS Error requesting api from front-end
  // https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
app.use( (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://ckgrill.rhemi.co');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  next();
});

// prevent cross site scripting attacks
// TODO - check if this needs to only be added to the auth endpoints
/*
app.all('*', (req, res, next) => {
   res.cookie('XSRF-TOKEN', req.csrfToken);
})
*/

// tell app to use the api routes
app.use('/api', orderRoutes);
app.use('/api', menuRoutes);
app.use('/api', categoryRoutes);
app.use('/api', itemRoutes);
app.use('/api', checkoutRoutes);
app.use('/api', restaurantRoutes);

app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('now we cookin');
});

// making server listen
app.listen(PORT, () => {
   console.log('Backend server is running on port', PORT);
});