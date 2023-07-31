const request = require('supertest');
const express = require('express');
const app = require('./app');

describe('Gateway API server', () => {
  // Test to check if the server is running
  test('Server is running', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Gateway API server is running');
  });

    // Test to check if a successful redirect is possible
    test('Successful redirect', async () => {
      const targetServerResponse = 'Hello from the target server';
      const targetServerPort = 8001;
  
      // Mock the target server by creating a simple express server
      const targetApp = express();
      targetApp.get('/', (req, res) => {
        res.send(targetServerResponse);
      });
      const targetServer = targetApp.listen(targetServerPort);
  
      // Make a request to the gateway to redirect to the target server
      const response = await request(app).get('/c');
  
      // The target server is no longer needed, so close it
      targetServer.close();
  
      expect(response.status).toBe(200);
      expect(response.text).toBe(targetServerResponse);
    });

      // Test to check how the gateway handles an offline target
  test('Handling an offline target', async () => {
    // Make a request to the gateway to redirect to the target server
    const response = await request(app).get('/u');

    // The gateway should return a 504 Bad Gateway Timeout status code when the target is offline
    expect(response.status).toBe(504);
  });

  // close the express app at the end of all tests
  // afterAll(() => {
  //   app.close();
  // });
});
