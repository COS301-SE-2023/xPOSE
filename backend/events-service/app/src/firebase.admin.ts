import * as admin from 'firebase-admin';

const serviceAccount = require('../permissions.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://xpose-4f48c-default-rtdb.firebaseio.com"
});

export { admin };
