const { getEvent } = require('../routes/getEvent'); 
const { User, Event, EventParticipant, EventJoinRequest, EventInvitation } = require('../data-access/sequelize');

jest.mock('../data-access/sequelize', () => ({
  User: {
    findOne: jest.fn(),
  },
  Event: {
    findOne: jest.fn(),
  },
  EventParticipant: {
    findOne: jest.fn(),
  },
  EventJoinRequest: {
    findOne: jest.fn(),
  },
  EventInvitation: {
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
};

describe('getEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve an event', async () => {
    // Mock necessary functions
    const mockUser = { id: 1, uid: 'mockUserId' };
    const mockEvent = {
      id: 1,
      code: 'mockEventCode',
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      toJSON: jest.fn(() => ({
        // Mock event data
      })),
      owner: { uid: 'mockOwnerUid' },
    };
    User.findOne.mockResolvedValueOnce(mockUser);
    Event.findOne.mockResolvedValueOnce(mockEvent);
    EventParticipant.findOne.mockResolvedValueOnce(null);
    EventJoinRequest.findOne.mockResolvedValueOnce(null);
    EventInvitation.findOne.mockResolvedValueOnce(null);

    
   
  });

  it('should return error if event not found', async () => {
    User.findOne.mockResolvedValueOnce({ id: 1, uid: 'mockUserId' });
    Event.findOne.mockResolvedValueOnce(null);

    
  });

  
});
