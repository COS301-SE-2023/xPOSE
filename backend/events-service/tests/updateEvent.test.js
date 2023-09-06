const { updateEvent } = require('../routes/updateEvent'); 

// Mocks
jest.mock('../data-access/sequelize', () => {
  return {
    User: {
      findOne: jest.fn(),
    },
    Event: {
      findOne: jest.fn(),
    },
  };
});

jest.mock('../data-access/firebase.repository', () => {
  return jest.fn(); 
});

describe('updateEvent', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { code: 'event-code' },
      body: { uid: 'user-uid', title: 'Updated Event', description: 'Updated Description' },
      file: null, 
    };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the event if the user owns it and provide a new image URL', async () => {
    const mockUser = { id: 1 };
    const mockEvent = { id: 1, owner_id_fk: 1, update: jest.fn() };

    // Mock User.findOne to return the user
    User.findOne.mockResolvedValue(mockUser);

    // Mock Event.findOne to return the event
    Event.findOne.mockResolvedValue(mockEvent);

    // Mock the image upload function to return a URL
    const uploadImageToFirebase = require('../data-access/firebase.repository');
    uploadImageToFirebase.mockResolvedValue('https://example.com/image.jpg');

    await updateEvent(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { uid: 'user-uid' },
    });

    expect(Event.findOne).toHaveBeenCalledWith({
      where: { code: 'event-code' },
    });

    expect(mockEvent.update).toHaveBeenCalledWith({
      uid: 'user-uid',
      title: 'Updated Event',
      description: 'Updated Description',
      image_url: 'https://example.com/image.jpg', // URL from the image upload function
    });

    expect(res.json).toHaveBeenCalledWith(mockEvent);
  });

  it('should update the event without an image URL if no image is provided', async () => {
    const mockUser = { id: 1 };
    const mockEvent = { id: 1, owner_id_fk: 1, update: jest.fn() };

    // Mock User.findOne to return the user
    User.findOne.mockResolvedValue(mockUser);

    // Mock Event.findOne to return the event
    Event.findOne.mockResolvedValue(mockEvent);

    await updateEvent(req, res);

    expect(mockEvent.update).toHaveBeenCalledWith({
      uid: 'user-uid',
      title: 'Updated Event',
      description: 'Updated Description',
    });

    expect(res.json).toHaveBeenCalledWith(mockEvent);
  });

  it('should handle errors and return a 500 status code', async () => {
    // Mock User.findOne to throw an error
    User.findOne.mockRejectedValue(new Error('Database error'));

    await updateEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update the event' });
  });

 
});
