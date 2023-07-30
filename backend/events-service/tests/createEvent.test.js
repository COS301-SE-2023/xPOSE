const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../data-access/sequelize');
const { User, Event, EventParticipant } = require('../data-access/sequelize');

// Test suite for createEvent.js

// start datebase before running tests

describe('createEvent.js', () => {
  // Connect to the database before running the tests
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Test to check successful event creation
  test('Successful event creation', async () => {
    const mockUser = await User.create({ uid: 'user123' });

    const eventData = {
      uid: mockUser.uid,
      title: 'Test Event',
      description: 'This is a test event',
      location: 'Test Location',
      latitude: 12.3456,
      longitude: -98.7654,
      start_date: new Date().toISOString(),
      end_date: new Date(new Date().getTime() + 3600000).toISOString(), // One hour from now
      privacy_setting: 'public',
    };

    const response = await request(app)
      .post('/events')
      .field('uid', eventData.uid)
      .field('title', eventData.title)
      .field('description', eventData.description)
      .field('location', eventData.location)
      .field('latitude', eventData.latitude)
      .field('longitude', eventData.longitude)
      .field('start_date', eventData.start_date)
      .field('end_date', eventData.end_date)
      .field('privacy_setting', eventData.privacy_setting);

    // Assert the response status and data
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', eventData.title);
    expect(response.body).toHaveProperty('description', eventData.description);
    expect(response.body).toHaveProperty('location', eventData.location);
    expect(response.body).toHaveProperty('start_date', eventData.start_date);
    expect(response.body).toHaveProperty('end_date', eventData.end_date);

    // Check if the event exists in the database
    const createdEvent = await Event.findOne({ where: { id: response.body.id } });
    expect(createdEvent).toBeTruthy();

    // Check if the owner is added as a participant
    const participants = await EventParticipant.findAll({ where: { event_id_fk: response.body.id } });
    expect(participants).toHaveLength(1);
    expect(participants[0].user_id_fk).toBe(mockUser.id);
  });

// Test to check missing required fields
  test('Missing required fields', async () => {
    const response = await request(app).post('/events').send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  // Test to check invalid user
    test('Invalid user', async () => {
    const eventData = {
      uid: 'invalidUser',
      title: 'Test Event',
      description: 'This is a test event',
      location: 'Test Location',
      latitude: 12.3456,
      longitude: -98.7654,
      start_date: new Date().toISOString(),
      end_date: new Date(new Date().getTime() + 3600000).toISOString(), // One hour from now
      privacy_setting: 'public',
    };
  
    const response = await request(app)
      .post('/events')
      .field('uid', eventData.uid)
      .field('title', eventData.title)
      .field('description', eventData.description)
      .field('location', eventData.location)
      .field('latitude', eventData.latitude)
      .field('longitude', eventData.longitude)
      .field('start_date', eventData.start_date)
      .field('end_date', eventData.end_date)
      .field('privacy_setting', eventData.privacy_setting);
  
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid user');
  });  
  
});
