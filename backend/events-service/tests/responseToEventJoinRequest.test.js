const { responseToEventJoinRequest } = require('../routes/responseToEventJoinRequest'); 

// Mocks
jest.mock('../data-access/sequelize', () => {
  return {
    User: {
      findOne: jest.fn(),
    },
    Event: {
      findOne: jest.fn(),
    },
    EventJoinRequest: {
      findOne: jest.fn(),
      update: jest.fn(),
    },
    EventParticipant: {
      create: jest.fn(),
    },
  };
});

describe('responseToEventJoinRequest', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: { uid: 'user-uid' },
      params: { code: 'event-code' },
      body: { response: 'accepted' },
    };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if required fields are missing', async () => {
    // Missing uid in the query
    req.query.uid = undefined;

    await responseToEventJoinRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid request. Required fields are missing.' });
  });

  it('should return an error if response is neither "accepted" nor "rejected"', async () => {
    // Invalid response
    req.body.response = 'invalid-response';

    await responseToEventJoinRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid response. Response must be either "accepted" or "rejected".' });
  });

  
});
