const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const routes = require('./routes.json');

const app = express();

// Enable CORS
app.use(cors());

// Create proxies for each route
Object.entries(routes).forEach(([path, target]) => {
  app.use(path, createProxyMiddleware({
    target,
    pathRewrite: {
      [`^${path}`]: '',
    },
    changeOrigin: true,
  }));
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Gateway API server is running on port ${port}`);
});
