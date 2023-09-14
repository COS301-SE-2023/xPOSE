const { createEventPost} = require('../routes/createEventPost'); 
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
  
  jest.mock('../data-access/firebase.repository', () => {
    return {
      uploadImageToFirebase: jest.fn().mockResolvedValue('https://example.com/image.jpg'),
    };
  });
  
  describe('createEventPost', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        query: { uid: 'user-uid' },
        params: { event_id: 'event-id' },
        file: 'sample-image-data', // Mocked file data
      };
      res = {
        json: jest.fn(),
        status: jest.fn(() => res),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should create a new event post', async () => {
      await createEventPost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: expect.any(String),
        image_url: 'https://example.com/image.jpg',
        uid: 'user-uid',
        timestamp: expect.any(Object), // want to check the timestamp
      });
  
      // Verify Firestore interactions
      expect(admin.firestore.collection).toHaveBeenCalledWith('Event-Posts');
      expect(admin.firestore.doc).toHaveBeenCalledWith('event-id');
      expect(admin.firestore.collection).toHaveBeenCalledWith('posts');
      expect(admin.firestore.add).toHaveBeenCalledWith({
        image_url: 'https://example.com/image.jpg',
        uid: 'user-uid',
        timestamp: expect.any(Object), // want to check the timestamp
      });
  
      
      expect(uploadImageToFirebase).toHaveBeenCalledWith('user-uid', 'sample-image-data');
    });
  
    it('should return a 400 error if required parameters are missing', async () => {
      
      req.file = undefined;
  
      await createEventPost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required parameters',
      });
    });
  
    it('should handle errors and return a 500 status code', async () => {
   
      admin.firestore.add.mockRejectedValue(new Error('Firestore error'));
  
      await createEventPost(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Something went wrong',
      });
    });
  
  
  });
  