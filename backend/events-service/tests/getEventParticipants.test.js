const { getEventParticipants } = require('../routes/getEventParticipants');


jest.mock('../data-access/sequelize', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const User = dbMock.define('User', {
    uid: 'gdct6f3feg',
  });

  const Event = dbMock.define('Event', {
    code: 'fytwfge243e',
  });

  const EventParticipant = dbMock.define('EventParticipant', {
    timestamp: '2023-08-01T12:00:00.000Z',
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
            exists: docId === 'gdct6f3feg',
            data: () => ({ displayName: 'John Doe' }),
          })
        ),
      }),
    }),
  }),
}));

describe('getEventParticipants', () => {
  test('should get the event participants', async () => {
    const req = {
      query: {
        uid: 'gdct6f3feg',
      },
      params: {
        code: 'fytwfge243e',
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await getEventParticipants(req, res);

    // Assertions
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([
      
      {
        uid: 'gdct6f3feg',
        display_name: 'John Doe',
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    ]);
  });

  test('should return 404 when the event does not exist', async () => {
    const req = {
      query: {
        uid: 'gdct6f3feg',
      },
      params: {
        code: 'nonExistingCode',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getEventParticipants(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Event not found' });
  });

  test('should return an empty array when the event has no participants', async () => {
    const req = {
      query: {
        uid: 'gdct6f3feg',
      },
      params: {
        code: 'fytwfge243e',
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const { EventParticipant } = require('../data-access/sequelize');
    EventParticipant.findAll.mockResolvedValue([]);

    await getEventParticipants(req, res);

    // Assertions
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([]);
  });

  
});
