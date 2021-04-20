/*
const signUpForRhemi = document.querySelector('#signup-rhemi');
const getStartedTodayButton = document.querySelector('#block-yui_3_17_2_1_1618525006570_5706');
const signUpForStripe = document.querySelector('#setup-payments');

// do i gotta pull this string out??? or does it not matter since its the publishable key??

// TEST KEY
const stripe = Stripe('pk_test_51H0IWVL4UppL0br2bYSp1tlwvfoPwDEjfjPUx4ilY0zQr8LY0txFJjj9CHqPTP27ieDiTHhxQfNlaKSuPVcNkuq00071qG37ks')

// LIVE KEY
const stripe = Stripe('pk_live_51H0IWVL4UppL0br24eHsSMTrCwqn14x1ZO9Sss27X1lHVrX7dsIHRIOSKAqU9yoi4YwmDYsPq5wMOknK3L3XdV6E00EVOPuHvc);

const createCheckoutSession = (priceId) => {
   return fetch("/api/signup-rhemi", {
      method: "POST",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({
         priceId: priceId
      })
   }).then(result => {
      return result.json();
   });
};

if (signUpForRhemi) {
   // PRICE ID - should be passed in somewhere huh?? 
   // prolly as a .env variable
   const LIVE_PRICE_ID = 'price_1Ii9RtL4UppL0br25NNkXgJ9';
   signUpForRhemi.addEventListener("click", e => {
      createCheckoutSession(LIVE_PRICE_ID).then(data => {
         // Call Stripe.js method to redirect to the new Checkout page
         stripe.redirectToCheckout({
            sessionId: data.sessionId
         })
         .then(handleResult);
      });
   });   
}

if (signUpForStripe) {
   signUpForStripe.addEventListener("click", e => {
      // console.log(e);
      fetch("/api/signup-user-stripe-acct", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         }
      })
         .then(response => response.json())
         .then(data => {
            console.log(data);
            if (data.url) {
               window.location = data.url;
            } else {
               //    signUpForStripe.removeAttribute("disabled");
               //    signUpForStripe.textContent = "<Something went wrong>";
               //    console.log("data", data);
            }
         });
   },
      // false // not sure what this does
   );
}
*/