const { getEventsFeed } = require('../routes/getEventsFeed'); // Adjust the path accordingly
const {
  User,
  Event,
  EventParticipant,
  EventJoinRequest,
  EventInvitation,
  Tag,
  EventTag,
} = require('../data-access/sequelize');

jest.mock('../data-access/sequelize', () => ({
  User: {
    findOne: jest.fn(),
  },
  Event: {
    findAll: jest.fn(),
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
  Tag: {
    findAll: jest.fn(),
  },
  EventTag: {
    findAll: jest.fn(),
  },
}));

const mockRequest = {
  query: {
    uid: 'mockUserId',
    tags: 'tag1,tag2',
    dates: '2023-09-27T10:00:00Z,2023-09-28T12:00:00Z',
    title: 'Test Event',
    description: 'Test Event Description',
    status: 'upcoming',
    code: '123456',
    n: '5',
    owner: 'ownerUid',
    participant: 'participantUid',
  },
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('getEventsFeed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve events based on query parameters', async () => {
    // Mock necessary functions
    const mockUser = { id: 1 };
    const mockEvent1 = {
      id: 1,
      start_date: '2023-09-27T10:00:00Z',
      end_date: '2023-09-27T12:00:00Z',
      owner: {
        uid: 'ownerUid',
      },
      toJSON: jest.fn().mockReturnValue({
        id: 1,
        start_date: '2023-09-27T10:00:00Z',
        end_date: '2023-09-27T12:00:00Z',
        status: 'upcoming',
        user_event_position: 'none',
        owner: 'ownerUid',
        tags: ['tag1', 'tag2'],
      }),
    };
    const mockEvent2 = {
      id: 2,
      start_date: '2023-09-28T10:00:00Z',
      end_date: '2023-09-28T12:00:00Z',
      owner: {
        uid: 'ownerUid',
      },
      toJSON: jest.fn().mockReturnValue({
        id: 2,
        start_date: '2023-09-28T10:00:00Z',
        end_date: '2023-09-28T12:00:00Z',
        status: 'upcoming',
        user_event_position: 'none',
        owner: 'ownerUid',
        tags: ['tag1', 'tag2'],
      }),
    };
    Event.findAll.mockResolvedValueOnce([mockEvent1, mockEvent2]);
    User.findOne.mockResolvedValueOnce(mockUser);
    EventParticipant.findOne.mockResolvedValueOnce(null);
    Tag.findAll.mockResolvedValueOnce([{ tag_name: 'tag1' }, { tag_name: 'tag2' }]);
    EventTag.findAll.mockResolvedValueOnce([{ tag: { tag_name: 'tag1' } }, { tag: { tag_name: 'tag2' } }]);

    
  });

 
});
