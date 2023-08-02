const { deleteEvent } = require('../routes/deleteEvent');


jest.mock('../data-access/sequelize', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const User = dbMock.define('User', {
    uid: 'gfcyw45gdf',
  });

  const Event = dbMock.define('Event', {
    code: 'eventCode',
    owner_id_fk: 1,
  });

  return {
    sequelize: dbMock,
    User,
    Event,
  };
});

jest.mock('../data-access/firebase.repository', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));

jest.mock('firebase-admin', () => ({
  auth: () => ({
    deleteUser: jest.fn(() => Promise.resolve()),
  }),
}));

describe('deleteEvent', () => {
  test('should delete the event when the user owns it', async () => {
    const req = {
      query: {
        uid: 'gfcyw45gdf',
      },
      params: {
        code: 'eventCode',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
      json: jest.fn(),
    };

    await deleteEvent(req, res);

    // Assertions
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  test('should return 404 when the event does not exist', async () => {
    const req = {
      query: {
        uid: 'gfcyw45gdf',
      },
      params: {
        code: 'nonExistingCode',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteEvent(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Event not found' });
  });

  test('should return 404 when the user does not exist', async () => {
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

    await deleteEvent(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User does not exist' });
  });

  test('should return 400 when the user does not own the event', async () => {
    const req = {
      query: {
        uid: 'userB', 
      },
      params: {
        code: 'eventCode',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteEvent(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User does not own this event' });
  });

  test('should return 500 for any unexpected error', async () => {
    const req = {
      query: {
        uid: 'gfcyw45gdf',
      },
      params: {
        code: 'eventCode',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    
    const errorMessage = 'Something went wrong';
    const { Event } = require('../data-access/sequelize');
    Event.findOne.mockRejectedValue(new Error(errorMessage));

    await deleteEvent(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete the event' });
  });
});
