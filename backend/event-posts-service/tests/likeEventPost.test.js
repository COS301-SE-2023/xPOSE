const { likeEventPost } = require('../routes/likeEventPost'); 
// Mocks
jest.mock('firebase-admin', () => {
  const firestoreMock = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    get: jest.fn(),
  };

  return {
    firestore: jest.fn(() => firestoreMock),
    FieldValue: {
      serverTimestamp: jest.fn(),
    },
  };
});

describe('likeEventPost', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { event_id: 'event-id', post_id: 'post-id' },
      body: { uid: 'user-id' },
    };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should like an event post', async () => {
    // Mock Firestore interactions
    const likeSnapshot = {
      empty: true, // Simulate that the user has not liked the post yet
    };
    admin.firestore().collection().doc().collection().doc().collection().where().get.mockResolvedValue(likeSnapshot);

    await likeEventPost(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ uid: 'user-id', timestamp: expect.anything() });

    // Verify Firestore interactions
    expect(admin.firestore().collection).toHaveBeenCalledWith('Event-Posts');
    expect(admin.firestore().doc).toHaveBeenCalledWith('event-id');
    expect(admin.firestore().collection).toHaveBeenCalledWith('posts');
    expect(admin.firestore().doc).toHaveBeenCalledWith('post-id');
    expect(admin.firestore().collection).toHaveBeenCalledWith('likes');
    expect(admin.firestore().add).toHaveBeenCalled();
  });

  it('should return a 400 error if required parameters are missing', async () => {
    // Missing event_id in the request
    req.params.event_id = undefined;

    await likeEventPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing required parameters',
    });
  });

  it('should return a 400 error if the user has already liked the post', async () => {
    // Mock Firestore interactions to simulate that the user has already liked the post
    const likeSnapshot = {
      empty: false,
    };
    admin.firestore().collection().doc().collection().doc().collection().where().get.mockResolvedValue(likeSnapshot);

    await likeEventPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User has already liked this post',
    });
  });

  it('should handle errors and return a 500 status code', async () => {
    // Mock Firestore interactions to throw an error
    admin.firestore().collection().doc().collection().doc().collection().where().get.mockRejectedValue(new Error('Firestore error'));

    await likeEventPost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Something went wrong',
    });
  });

 
});
