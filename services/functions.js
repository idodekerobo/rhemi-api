const TAX_RATE = parseFloat(process.env.AZ_TAX_RATE);

// function that returns price including the items add-ons or sides
const calcPriceWithAddOns = (item) => {
   if (!item) return; // don't do anything if item is null/undefined/falsey
   let price = item.price; // base item price
   const config = item.config // sides/add-ons to item
   const keys = Object.keys(config); // keys to config object showing all sides/add-ons

   // loop through each key in the config object
   for (let i = 0; i < keys.length; i++) {
      // dot notation to acces the object doesn't work.. not exactly sure why
      let currentKey = keys[i];
      let currentObj = config[currentKey];

      // check if this key has an element that is an array of objects
      if (keys[i] === 'specialInstructions') {
      } else if (Array.isArray(currentObj)) {
         // check deeper because it is an array, loop through each element of array
         for (let u = 0; u < currentObj.length; u++) {
            let element = currentObj[u];
            price += element.price;
         }
      } else {
         // not an arr, no need to go any deeper
         price += currentObj.price;
      }
   }
   return price; // return final price
}

const calculateOrderAmount = (items) => {
   const subtotal = items.slice().reduce((acc, obj) => (acc += calcPriceWithAddOns(obj)), 0).toFixed(2);
   const tax = (subtotal * TAX_RATE).toFixed(2);
   const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
   const stripeTotal = ((total*100).toFixed(0)); // returning the total w/ sales tax. fixing to 0 because we only need the two decimal points

   const price = {
      subtotal,
      tax,
      total,
      stripeTotal
   }
   return price;
}

module.exports = { 
   calculateOrderAmount
}