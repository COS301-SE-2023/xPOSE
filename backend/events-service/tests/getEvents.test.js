const { getEvents } = require('../routes/getEvents');

// Mock Sequelize models and Firebase Admin SDK
jest.mock('../data-access/sequelize', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const User = dbMock.define('User', {
    uid: 'userA',
  });

  const Event = dbMock.define('Event', {
    code: 'eventCode',
    owner_id_fk: 'userA', 
    start_date: '2023-08-01T12:00:00.000Z',
    end_date: '2023-08-02T12:00:00.000Z',
  });

  const EventParticipant = dbMock.define('EventParticipant', {
    user_id_fk: 'userA',
    event_id_fk: 'eventCode',
  });

 

  return {
    sequelize: dbMock,
    User,
    Event,
    EventParticipant,
    
  };
});

jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: (collectionName) => ({
      doc: (docId) => ({
        get: jest.fn(() =>
          Promise.resolve({
            exists: docId === 'userA',
            data: () => ({ displayName: 'John Doe' }),
          })
        ),
      }),
    }),
  }),
}));

describe('getEvents', () => {
  test('should get all events', async () => {
    const req = {
      query: {
        uid: 'userA',
      },
    };
    const res = {
      json: jest.fn(),
    };

    await getEvents(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalledWith([
      
      {
        code: 'eventCode',
        user_event_position: 'owner',
        owner: 'userA',
        
      },
    ]);
  });

  test('should get participant events', async () => {
    const req = {
      query: {
        uid: 'userA',
        filter: 'participant',
      },
    };
    const res = {
      json: jest.fn(),
    };

    await getEvents(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalledWith([
      
      {
        code: 'eventCode',
        user_event_position: 'participant',
        owner: 'userA',
        
      },
    ]);
  });

  test('should return 400 when uid is missing', async () => {
    const req = {
      query: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getEvents(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
  });

});
