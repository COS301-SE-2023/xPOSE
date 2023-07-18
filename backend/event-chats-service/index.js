const express = require('express');
const app = express();
const PORT = 8001;
// const admin = require('firebase-admin');
const cors = require('cors');
const router = require('./router');
const bodyParser = require('body-parser');

// Initialize Express Middleware
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', router);

// simple config
app.get('/', (req, res) => {
    res.send('Welcome to the Event Chats Service');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

