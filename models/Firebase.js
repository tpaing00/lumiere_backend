// require('dotenv').config(); // Load environment variables from .env file
// const firebase = require('firebase/app');
// //const firebase = require('firebase');
// require('firebase/auth');

// //Initialize Firebase
// const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API_KEY,
//     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.FIREBASE_APP_ID,
//     measurementId: process.env.FIREBASE_MEASUREMENT_ID
// };

// firebase.initializeApp(firebaseConfig);

const admin = require('firebase-admin');


// Initialize Firebase Admin SDK
const serviceAccount = require('../key/serviceAccountKey.json'); // Path to your service account key file
const firebaseAdminConfig = {
    credential: admin.credential.cert(serviceAccount)
};

admin.initializeApp(firebaseAdminConfig);

module.exports = admin;