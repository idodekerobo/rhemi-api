/*
const signUpForRhemi = document.querySelector('#signup-rhemi');
const signUpForStripe = document.querySelector('#setup-payments');

const signUpRhemiElementArr = document.querySelectorAll("a[href='https://www.rhemi.co/api/signup-rhemi']");
const signUpForStripeElementArr = document.querySelectorAll("a[href='https://www.rhemi.co/api/signup-user-stripe-acct']");

// do i gotta pull this string out??? or does it not matter since its the publishable key??
const stripe = Stripe('pk_test_51H0IWVL4UppL0br2bYSp1tlwvfoPwDEjfjPUx4ilY0zQr8LY0txFJjj9CHqPTP27ieDiTHhxQfNlaKSuPVcNkuq00071qG37ks')

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

if (signUpRhemiElementArr) {
   // PRICE ID - should be passed in somewhere huh?? 
   // prolly as a .env variable
   const PRICE_ID = 'price_1IgabGL4UppL0br2v5JkOJHt';
   for (let i=0; i < signUpRhemiElementArr.length; i++) {

      signUpRhemiElementArr[i].addEventListener("click", e => {
         createCheckoutSession(PRICE_ID).then(data => {
            // Call Stripe.js method to redirect to the new Checkout page
            stripe.redirectToCheckout({
               sessionId: data.sessionId
            })
            .then(handleResult);
         });
      });   

   }
}

if (signUpForStripeElementArr) {
   for (let i=0; i < signUpForStripeElementArr.length; i++) {
      signUpForStripeElementArr[i].addEventListener("click", e => {
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
}
*/