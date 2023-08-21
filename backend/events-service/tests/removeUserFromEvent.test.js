const { removeUserFromEvent } = require('../routes/removeUserFromEvent');  

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
      destroy: jest.fn(),
    },
  };
});

describe('removeUserFromEvent', () => {
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

    await removeUserFromEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

});
