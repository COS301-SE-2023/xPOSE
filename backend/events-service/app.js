const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const router = require('./router');
const {sequelize} = require('./data-access/sequelize');
const admin = require('firebase-admin');

// app.use(cors);
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', router);

// Initialize Firebase Admin SDK
// const serviceAccount = require('./permissions.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://xpose-4f48c-default-rtdb.firebaseio.com',
//   storageBucket: 'gs://xpose-4f48c.appspot.com',
// });

// simple config
const PORT = 8004;

// only start the server if the database is up
// console.log(sequelize);
sequelize
.sync({ force: false })
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on Port ${PORT}`);
    });
})
.catch((error) => {
    console.error('Failed to start the server');
})

