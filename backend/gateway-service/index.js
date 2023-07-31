const app = require('./app');
const https = require('https');
const fs = require('fs');

// HTTPS options
const httpsOptions = {
  key: fs.readFileSync('private_key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};

// Start the server with HTTPS
const port = 8000;
https.createServer(httpsOptions, app).listen(port, () => {
  console.log(`Gateway API server is running on port ${port}`);
});
