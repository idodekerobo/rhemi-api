require('dotenv').config();
const admin = require("firebase-admin");

admin.initializeApp({
   credential: admin.credential.cert({
      "type": process.env.FIREBASE_ACCT,
      "project_id": process.env.FIREBASE_ACCT_PROJ_ID,
      "private_key_id": process.env.FIREBASE_ACCT_PRIV_KEY_ID,
      "private_key": process.env.FIREBASE_ACCT_PRIV_KEY.replace(/\\n/g, '\n'),
      "client_email": process.env.FIREBASE_ACCT_CLIENT_EMAIL,
      "client_id": process.env.FIREBASE_ACCT_CLIENT_ID,
      "auth_uri": process.env.FIREBASE_ACCT_AUTH_URI,
      "token_uri": process.env.FIREBASE_ACCT_TOKEN_URI,
      "auth_provider_x509_cert_url": process.env.FIREBASE_ACCT_AUTH_PROVIDER,
      "client_x509_cert_url": process.env.FIREBASE_ACCT_CLIENT_X509_CERT
   }),
   databaseURL: "https://dash-7174b.firebaseio.com"
});
// TODO - do i have to do anything w/ persistence????
module.exports = { admin };