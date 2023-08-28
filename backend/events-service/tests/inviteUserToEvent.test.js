const { inviteUserToEvent } = require('../routes/inviteUserToEvent');

// Mock Sequelize models and Firebase Admin SDK
jest.mock('../data-access/sequelize', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const User = dbMock.define('User', {
    uid: 'userA',
  });

  const Event = dbMock.define('Event', {
    code: 'eventCode',
    title: 'Test Event',
    
  });

  const EventInvitation = dbMock.define('EventInvitation', {
    user_id_fk: 'userA',
    event_id_fk: 'eventCode',
    response: 'pending',
    timestamp: new Date(),
  });

  

  return {
    sequelize: dbMock,
    User,
    Event,
    EventInvitation,
   
  };
});

jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: () => ({
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

// Mock MessageBuilder and sender
jest.mock('../libs/MessageBuilder', () => {
  return jest.fn().mockImplementation(() => ({
    setType: jest.fn().mockReturnThis(),
    setMessage: jest.fn().mockReturnThis(),
    setSenderId: jest.fn().mockReturnThis(),
    setReceiverId: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({
      data: {
        type: 'join_event',
        message: 'You got invited to an event called Test Event',
        senderId: '173',
        receiverId: '999',
        timestamp: expect.any(Number),
        status: 'pending',
      },
    }),
  }));
});

jest.mock('../libs/sender', () => {
  return {
    send: jest.fn().mockReturnValue(true),
  };
});

describe('inviteUserToEvent', () => {
  test('should invite user to the event', async () => {
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
    };

    await inviteUserToEvent(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalled();
  });

  test('should return 404 when event not found', async () => {
    const req = {
      query: {
        uid: 'userA',
      },
      params: {
        code: 'nonExistentCode',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await inviteUserToEvent(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Event not found' });
  });

  test('should return 400 when user is already invited to the event', async () => {
    const req = {
      query: {
        uid: 'userA',
      },
      params: {
        code: 'eventCode',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock EventInvitation.findOne to return an existing invitation
    const { EventInvitation } = require('../data-access/sequelize');
    EventInvitation.findOne = jest.fn().mockResolvedValue(true);

    await inviteUserToEvent(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User is already invited to the event' });
  });

  test('should return 500 when failed to invite the user', async () => {
    const req = {
      query: {
        uid: 'userA',
      },
      params: {
        code: 'eventCode',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock EventInvitation.create to throw an error
    const { EventInvitation } = require('../data-access/sequelize');
    EventInvitation.create = jest.fn().mockRejectedValue(new Error('Mocked error'));

    await inviteUserToEvent(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to invite the user to the event' });
  });
});
