const { userRequestToJoinEvent } = require('../routes/userRequestToJoinEvent'); 

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
      create: jest.fn(),
    },
  };
});

jest.mock('../libs/sender', () => {
  return {
    sendMessageToQueue: jest.fn(),
  };
});

describe('userRequestToJoinEvent', () => {
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

  it('should create a join request and send a notification if the user has not sent a request before', async () => {
    const mockUser = { id: 1 };
    const mockEvent = { id: 1, owner_id_fk: 2 };
    const mockEventOwner = { uid: 'event-owner-uid' };

    // Mocks
    User.findOne.mockResolvedValue(mockUser);

   
    Event.findOne.mockResolvedValue(mockEvent);

    
    EventJoinRequest.findOne.mockResolvedValue(null);

   
    EventJoinRequest.create.mockResolvedValue({ id: 1 });

    
    User.findOne.mockResolvedValue(mockEventOwner);

    await userRequestToJoinEvent(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { uid: 'user-uid' },
    });

    expect(Event.findOne).toHaveBeenCalledWith({
      where: { code: 'event-code' },
    });

    expect(EventJoinRequest.findOne).toHaveBeenCalledWith({
      where: { user_id_fk: 1, event_id_fk: 1 },
    });

    expect(EventJoinRequest.create).toHaveBeenCalledWith({
      user_id_fk: 1,
      event_id_fk: 1,
      response: 'pending',
      timestamp: expect.any(Date),
    });

    expect(sendMessageToQueue).toHaveBeenCalledWith('notifications', {
      data: {
        type: 'join_event',
        message: 'Updated Event Request to join!',
        senderId: 'user-uid',
        receiverId: 'event-owner-uid',
        timestamp: expect.any(Number),
        status: 'pending',
      },
    });

    expect(res.json).toHaveBeenCalledWith({ id: 1 });
  });

  it('should return an error if the user has already sent a join request', async () => {
    // Mock EventJoinRequest.findOne to indicate that the user has already sent a request
    EventJoinRequest.findOne.mockResolvedValue({ id: 1 });

    await userRequestToJoinEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User has already sent a join request for the event' });
  });

  it('should handle errors and return a 500 status code', async () => {
    // Mock User.findOne to throw an error
    User.findOne.mockRejectedValue(new Error('Database error'));

    await userRequestToJoinEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to process the join request' });
  });

  
});
