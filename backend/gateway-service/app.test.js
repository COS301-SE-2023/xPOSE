const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const request = require('supertest');
const routes = require('./routes.json');

// Create the request instance targeting the API
const api = request('http://localhost:8000');

const app = express();

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

describe('Gateway API', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(8000, () => {
      console.log('Gateway API server is running on port 8000');
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

//   it('should proxy requests to the specified routes', async () => {
//     const response = await api.get('/example-route');
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({ message: 'Example route response' });
//   });

  it('should proxy requests to /e/status and return "Hello World!"', async () => {
    const response = await api.get('/e/status');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });

  // Add more test cases for other routes as needed
});
