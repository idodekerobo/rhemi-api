const express = require('express');
const bodyParser = require('body-parser');
const stripe = require("stripe")("sk_test_51H0IWVL4UppL0br2mRIA32VqHbDXIXGdOAmnEQloIisFwQKcvEVb5WgVuClYWEVOzSU52foQDPMzUNuBa9cZuSCv00CsXePgKR")
const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Require Routes 
const orderRoutes = require('./routes/order.js');


// Building Proxy Server for CORS Error requesting api from front-end
  // https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
app.use( (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  next();
});

app.use('/api', orderRoutes);

app.get('/', (req, res) => {
  res.send('now we cookin');
});

// making server listen
app.listen(PORT, () => {
    console.log('Backend server is running on port', PORT);
});