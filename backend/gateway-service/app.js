const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const routes = require('./routes.json');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

// Enable CORS
app.use(cors());

// Function to check if a target URL is online
async function isTargetOnline(target) {
  try {
    await axios.head(target);
    return 'Online';
  } catch (error) {
    return 'Offline';
  }
}

// Create proxies for each route
Object.entries(routes).forEach(async ([originalRoute, target]) => {
  const path = `^${originalRoute}`;

  app.use(originalRoute, createProxyMiddleware({
    target,
    pathRewrite: {
      [path]: '',
    },
    changeOrigin: true,
  }));

  const status = await isTargetOnline(target);
  console.table([{ 'Original Route': originalRoute, 'Path Rewrite': '', 'Target': target, 'Status': status }]);
});

// Add the Swagger documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Gateway API server is running');
});

module.exports = app;
