var admin = require("firebase-admin");

var serviceAccount = require("./credentials/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://xpose-4f48c-default-rtdb.firebaseio.com"
});
