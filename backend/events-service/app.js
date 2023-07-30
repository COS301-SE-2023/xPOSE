const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const router = require('./router');

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', router);

module.exports = app;