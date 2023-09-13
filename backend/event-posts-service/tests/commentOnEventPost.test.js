const {
    commentOnEventPost
  } = require('../routes/commentOnEventPost'); 
  
  // Mocks
  jest.mock('../data-access/firebase', () => {
    return {
      admin: {
        firestore: {
          collection: jest.fn().mockReturnThis(),
          doc: jest.fn().mockReturnThis(),
          add: jest.fn(),
          FieldValue: {
            serverTimestamp: jest.fn(),
          },
        },
      },
    };
  });
  
  describe('commentOnEventPost', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        query: { uid: 'user-uid' },
        params: { event_id: 'event-id', post_id: 'post-id' },
        body: { comment: 'Test comment' },
      };
      res = {
        json: jest.fn(),
        status: jest.fn(() => res),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should create a new comment on an event post', async () => {
      await commentOnEventPost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        uid: 'user-uid',
        comment: 'Test comment',
        timestamp: expect.any(Object), 
      });
  
      // Verify Firestore interactions
      expect(admin.firestore.collection).toHaveBeenCalledWith('Event-Posts');
      expect(admin.firestore.doc).toHaveBeenCalledWith('event-id');
      expect(admin.firestore.collection).toHaveBeenCalledWith('posts');
      expect(admin.firestore.doc).toHaveBeenCalledWith('post-id');
      expect(admin.firestore.collection).toHaveBeenCalledWith('comments');
      expect(admin.firestore.add).toHaveBeenCalledWith({
        uid: 'user-uid',
        comment: 'Test comment',
        timestamp: expect.any(Object), 
      });
    });
  
    it('should return a 400 error if required parameters are missing', async () => {
      
      req.body.comment = undefined;
  
      await commentOnEventPost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required parameters',
      });
    });
  
    it('should handle errors and return a 500 status code', async () => {
      // Mock Firestore add method to throw an error
      admin.firestore.add.mockRejectedValue(new Error('Firestore error'));
  
      await commentOnEventPost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Something went wrong',
      });
    });
  
    
  });
  