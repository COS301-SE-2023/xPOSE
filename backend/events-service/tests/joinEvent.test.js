const { joinEvent } = require('../routes/joinEvent');  // Adjust the import path

// Mocks
jest.mock('../data-access/sequelize', () => {
  return {
    User: {
      findOne: jest.fn(),
    },
    Event: {
      findOne: jest.fn(),
    },
    EventParticipant: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
  };
});

jest.mock('../data-access/firebase.repository', () => ({
  uploadImageToFirebase: jest.fn(),
}));

jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: () => ({
      doc: () => ({
        get: jest.fn(),
      }),
    }),
  }),
}));

describe('joinEvent', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: { uid: 'user-uid' },
      params: { code: 'event-code' },
    };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if user does not exist', async () => {
    
    User.findOne.mockResolvedValue(null);

    await joinEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user' });
  });

});
