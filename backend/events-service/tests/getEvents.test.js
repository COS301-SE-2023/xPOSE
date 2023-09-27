const { getEvents } = require('../routes/getEvents'); // Adjust the path accordingly
const { User, Event, EventParticipant, EventJoinRequest, EventInvitation } = require('../data-access/sequelize');

jest.mock('../data-access/sequelize', () => ({
  User: {
    findOne: jest.fn(),
  },
  Event: {
    findAll: jest.fn(),
  },
  EventParticipant: {
    findAll: jest.fn(),
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
    filter: 'all', 
  },
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('getEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve all events', async () => {
    // Mock necessary functions
    const mockUser = { id: 1 };
    const mockEvent1 = {
      id: 1,
      start_date: '2023-09-27T10:00:00Z',
      end_date: '2023-09-27T12:00:00Z',
      owner: {
        uid: 'ownerUid',
      },
    };
    const mockEvent2 = {
      id: 2,
      start_date: '2023-09-28T10:00:00Z',
      end_date: '2023-09-28T12:00:00Z',
      owner: {
        uid: 'ownerUid',
      },
    };
    Event.findAll.mockResolvedValueOnce([mockEvent1, mockEvent2]);
    User.findOne.mockResolvedValueOnce(mockUser);
   

    
  });

 

});
