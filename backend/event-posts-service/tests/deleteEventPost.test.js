const { deleteEventPost } = require('../routes/deleteEventPost'); // Adjust the import path

// Mocks
jest.mock('../data-access/firebase', () => {
  return {
    admin: {
      firestore: {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        delete: jest.fn(),
      },
    },
  };
});

describe('deleteEventPost', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { event_id: 'event-id', post_id: 'post-id' },
    };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete an event post', async () => {
    await deleteEventPost(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Post deleted successfully' });

    // Verify Firestore interactions
    expect(admin.firestore.collection).toHaveBeenCalledWith('Event-Posts');
    expect(admin.firestore.doc).toHaveBeenCalledWith('event-id');
    expect(admin.firestore.collection).toHaveBeenCalledWith('posts');
    expect(admin.firestore.doc).toHaveBeenCalledWith('post-id');
    expect(admin.firestore.delete).toHaveBeenCalled();
  });

  it('should return a 400 error if required parameters are missing', async () => {
    // Missing event_id in the request
    req.params.event_id = undefined;

    await deleteEventPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing required parameters',
    });
  });

  it('should handle errors and return a 500 status code', async () => {
    // Mock Firestore delete method to throw an error
    admin.firestore.delete.mockRejectedValue(new Error('Firestore error'));

    await deleteEventPost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Something went wrong',
    });
  });


});
