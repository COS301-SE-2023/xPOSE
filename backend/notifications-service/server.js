import express from 'express';
import bodyParser from  'body-parser';
import userRoute from './routes/notifications.js';
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://xpose-4f48c-default-rtdb.firebaseio.com"
});

// const messaging = admin.messaging();
const app = express();
const PORT = 8006;

// initialize body-parser middleware
app.use(bodyParser.json()); // will be using Json  data
app.use('/notifications', userRoute);
app.get('/', (req, res) => res.send(" Notifications services"));
app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));

