const { createEvent } = require('../routes/createEvent.js'); // Adjust the path accordingly
const { User,Event, EventInvitation, EventParticipant, Tag, EventTag } =  require('../data-access/sequelize');
const admin = require('firebase-admin');

jest.mock('../data-access/sequelize', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  Event: {
    create: jest.fn(),
  },
  Tag: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  EventTag: {
    create: jest.fn(),
  },
  EventParticipant: {
    create: jest.fn(),
  },
}));

jest.mock('../data-access/firebase.repository', () => ({
  uploadImageToFirebase: jest.fn(),
}));

jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: () => ({
      doc: jest.fn(),
      set: jest.fn(),
    }),
  }),
}));

describe('createEvent', () => {
  const mockRequest = {
    query: {
      uid: 'mockUserId',
    },
    body: {
      title: 'Event Title',
      description: 'Event Description',
      location: 'Event Location',
      latitude: 123.456,
      longitude: 789.123,
      start_date: '2023-09-30T12:00:00Z',
      end_date: '2023-09-30T14:00:00Z',
      privacy_setting: 'public',
      tags: ['tag1', 'tag2'],
    },
    file: null, // Mock file
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an event', async () => {
    // Mock necessary functions
    User.findOne.mockResolvedValueOnce(null); 
    User.create.mockResolvedValueOnce({ id: 1 }); 
    Event.create.mockResolvedValueOnce({ id: 1, code: 'mockEventCode' }); 
    Tag.findOne.mockResolvedValueOnce(null); 
    Tag.create.mockResolvedValueOnce({ id: 1 });
    EventTag.create.mockResolvedValueOnce({}); 
    EventParticipant.create.mockResolvedValueOnce({});
    admin.firestore().collection().doc.mockReturnValueOnce({
      set: jest.fn().mockResolvedValueOnce({}),
    });

    
  });
});
