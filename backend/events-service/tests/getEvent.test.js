const { getEvent } = require('../routes/getEvent');


jest.mock('../data-access/sequelize', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const User = dbMock.define('User', {
    uid: 'userA',
  });

  const Event = dbMock.define('Event', {
    code: 'eventCode',
    owner_id_fk: 1,
    start_date: '2023-08-01T12:00:00.000Z',
    end_date: '2023-08-02T12:00:00.000Z',
  });


  return {
    sequelize: dbMock,
    User,
    Event,
  
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

describe('getEvent', () => {
  test('should get the event details for an existing event and user', async () => {
    const req = {
      query: {
        uid: 'userA',
      },
      params: {
        code: 'eventCode',
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await getEvent(req, res);

    // Assertions
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      
      code: 'eventCode',
     
      owner_display_name: 'John Doe',
      user_event_position: 'owner',
    });
  });

  test('should return 404 when the event does not exist', async () => {
    const req = {
      query: {
        uid: 'userA',
      },
      params: {
        code: 'nonExistingCode',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getEvent(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Event not found' });
  });

  test('should return 404 when the user does not exist in Firestore', async () => {
    const req = {
      query: {
        uid: 'nonExistingUser',
      },
      params: {
        code: 'eventCode',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getEvent(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user' });
  });

  
});
