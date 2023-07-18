const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../permissions.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://xpose-4f48c-default-rtdb.firebaseio.com',
  storageBucket: 'gs://xpose-4f48c.appspot.com',
});

const db = admin.firestore();

module.exports = db;