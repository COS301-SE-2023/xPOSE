const request = require('supertest');
const app = require('./app');


describe('POST /upload', () => {
  it('should upload a file and return the file URL', async () => {
    const response = await request(app)
      .post('/upload')
      .field('userId', 'exampleUserId')
      .attach('file', './image.jpg');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('url');
  });
});

