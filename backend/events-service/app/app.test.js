const request = require('supertest');

const apiAddress = 'http://localhost:8004';

describe('App', () => {
  it('should return "Hello World!" when accessing /status', async () => {
    const response = await request(apiAddress).get('/status');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });

  it('should create an event when accessing POST /events', async () => {
    const response = await request(apiAddress)
      .post('/events')
      .field('eventName', 'Test Event')
      .field('eventDescription', 'This is a test event')
      .field('eventLocation', 'Test Location')
      .field('userId', '1743DgbGgNQu1QwQwuufMhTAtVg2')
      .field('eventStartDate', '2023-06-28')
      .field('eventEndDate', '2023-06-29')
      .field('eventPrivacySetting', 'public')
      .attach('coverImage', './image.jpg');
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('eventName', 'Test Event');
    expect(response.body).toHaveProperty('eventDescription', 'This is a test event');
    // Add more assertions for other properties of the created event
  });

  it('should retrieve an event when accessing GET /events/:eventId', async () => {
    // First, create an event and get its ID
    const createResponse = await request(apiAddress)
      .post('/events')
      // Provide necessary event data
      .attach('coverImage', 'image.jpg');
    const eventId = createResponse.body.id;

    // Retrieve the created event
    const response = await request(apiAddress).get(`/events/${eventId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', eventId);
    // Add more assertions for other properties of the retrieved event
  });

  it('should update an event when accessing PUT /events/:eventId', async () => {
    // First, create an event and get its ID
    const createResponse = await request(apiAddress)
      .post('/events')
      // Provide necessary event data
      .attach('coverImage', 'image.jpg');
    const eventId = createResponse.body.id;

    // Update the created event
    const response = await request(apiAddress)
      .put(`/events/${eventId}`)
      .send({
        eventName: 'Updated Event',
        eventDescription: 'This is an updated event',
        eventLocation: 'Updated Location',
        eventStartDate: '2023-06-30',
        eventEndDate: '2023-07-01'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Event updated successfully');
    // Retrieve the updated event and add assertions
  });

  it('should retrieve all events when accessing GET /events', async () => {
    const response = await request(apiAddress).get('/events');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // Add more assertions for the retrieved events
  });

  it('should delete an event when accessing DELETE /events/:eventId', async () => {
    // First, create an event and get its ID
    const createResponse = await request(apiAddress)
      .post('/events')
      // Provide necessary event data
      .attach('coverImage', 'image.jpg');
    const eventId = createResponse.body.id;

    // Delete the created event
    const response = await request(apiAddress).delete(`/events/${eventId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Event deleted successfully');
    // Assert that the event is no longer retrievable
  });

  it('should add a participant to an event when accessing POST /events/:eventId/participants', async () => {
    // First, create an event and get its ID
    const createResponse = await request(apiAddress)
      .post('/events')
      // Provide necessary event data
      .attach('coverImage', 'image.jpg');
    const eventId = createResponse.body.id;

    // Add a participant to the event
    const response = await request(apiAddress)
      .post(`/events/${eventId}/participants`)
      .send({ userId: '1743DgbGgNQu1QwQwuufMhTAtVg2' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Participant added successfully');
    // Retrieve the event and assert that the participant is added
  });

  it('should add a post to an event when accessing POST /events/:eventId/posts', async () => {
    // First, create an event and get its ID
    const createResponse = await request(apiAddress)
      .post('/events')
      // Provide necessary event data
      .attach('coverImage', 'image.jpg');
    const eventId = createResponse.body.id;

    // Add a post to the event
    const response = await request(apiAddress)
      .post(`/events/${eventId}/posts`)
      .send({ userId: '1743DgbGgNQu1QwQwuufMhTAtVg2', content: 'Test post content' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Post added successfully');
    // Retrieve the event and assert that the post is added
  });

  it('should add a chat message to an event when accessing POST /events/:eventId/chats', async () => {
    // First, create an event and get its ID
    const createResponse = await request(apiAddress)
      .post('/events')
      // Provide necessary event data
      .attach('coverImage', 'image.jpg');
    const eventId = createResponse.body.id;

    // Add a chat message to the event
    const response = await request(apiAddress)
      .post(`/events/${eventId}/chats`)
      .send({ userId: '1743DgbGgNQu1QwQwuufMhTAtVg2', message: 'Test chat message' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Chat message added successfully');
    // Retrieve the event and assert that the chat message is added
  });
});
