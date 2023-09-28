const { getEventParticipants } = require('../routes/getEventParticipants'); // Adjust the path accordingly
const { User, Event, EventParticipant } = require('../data-access/sequelize');

jest.mock('../data-access/sequelize', () => ({
  User: {
    findOne: jest.fn(),
  },
  Event: {
    findOne: jest.fn(),
  },
  EventParticipant: {
    findAll: jest.fn(),
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

describe('getEventParticipants', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve event participants', async () => {
    // Mock necessary functions
    const mockEvent = { id: 1, code: 'mockEventCode' };
    const mockParticipants = [
      {
        user: {
          uid: 'participant1Uid',
        },
        timestamp: new Date().toISOString(),
      },
      {
        user: {
          uid: 'participant2Uid',
        },
        timestamp: new Date().toISOString(),
      },
    ];
    Event.findOne.mockResolvedValueOnce(mockEvent);
    EventParticipant.findAll.mockResolvedValueOnce(mockParticipants);
    // Mock the Firestore call to get display names
    const firestoreMockData = [
      { data: () => ({ displayName: 'Participant 1' }) },
      { data: () => ({ displayName: 'Participant 2' }) },
    ];
    const mockFirestoreGet = jest.fn().mockReturnValueOnce(Promise.resolve(firestoreMockData[0]))
      .mockReturnValueOnce(Promise.resolve(firestoreMockData[1]));
    const mockFirestoreCollection = jest.fn(() => ({ doc: mockFirestoreGet }));
    jest.mock('firebase-admin', () => ({
      firestore: () => ({
        collection: mockFirestoreCollection,
      }),
    }));

     
  
  });

  it('should return an empty array if event has no participants', async () => {
    const mockEvent = { id: 1, code: 'mockEventCode' };
    Event.findOne.mockResolvedValueOnce(mockEvent);
    EventParticipant.findAll.mockResolvedValueOnce([]);

    
  });

  it('should return an error if event not found', async () => {
    Event.findOne.mockResolvedValueOnce(null);

    
  });

  
});
