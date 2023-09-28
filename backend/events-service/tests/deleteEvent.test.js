const { deleteEvent } = require('../routes/deleteEvent'); // Adjust the path accordingly
const { User, Event } = require('../data-access/sequelize');

jest.mock('../data-access/sequelize', () => ({
  User: {
    findOne: jest.fn(),
  },
  Event: {
    findOne: jest.fn(),
  },
}));

const mockRequest = {
  query: {
    uid: 'mockUserId',
  },
  params: {
    code: 'mockEventCode',
  },
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  sendStatus: jest.fn(),
};

describe('deleteEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete an event', async () => {
    // Mock necessary functions
    const mockUser = { id: 1, uid: 'mockUserId' };
    const mockEvent = { id: 1, code: 'mockEventCode', owner_id_fk: 1 };
    User.findOne.mockResolvedValueOnce(mockUser);
    Event.findOne.mockResolvedValueOnce(mockEvent);

  });

  it('should return error if user does not exist', async () => {
    User.findOne.mockResolvedValueOnce(null);

  });

  it('should return error if event does not exist', async () => {
    User.findOne.mockResolvedValueOnce({ id: 1, uid: 'mockUserId' });
    Event.findOne.mockResolvedValueOnce(null);

  });

  it('should return error if user does not own the event', async () => {
    const mockUser = { id: 1, uid: 'mockUserId' };
    const mockEvent = { id: 1, code: 'mockEventCode', owner_id_fk: 2 };
    User.findOne.mockResolvedValueOnce(mockUser);
    Event.findOne.mockResolvedValueOnce(mockEvent);

  
  });
});
