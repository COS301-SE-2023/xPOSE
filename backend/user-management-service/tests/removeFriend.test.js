import admin from 'firebase-admin';
import { removeFriend } from '../controllers/removeFriend.js'; // Replace with the correct path to the function

// Mock Firebase Firestore interactions
jest.mock('firebase-admin', () => {
  const firestore = jest.fn();
  firestore.collection = jest.fn(() => firestore);
  firestore.doc = jest.fn(() => firestore);
  firestore.update = jest.fn();
  firestore.delete = jest.fn();
  firestore.FieldValue = {
    arrayRemove: jest.fn(),
  };
  return { firestore };
});

describe('removeFriend', () => {
  let req;
  let res;

  beforeEach(() => {
    // Initialize req and res objects for each test
    req = {
      params: {
        userId: 'udyy7ey8ru3i',
        requestId: 'hgf7y39kokfoi9',
      },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  it('should remove a friend', async () => {
    // Call the function with mocked dependencies
    await removeFriend(req, res);

    // Check if Firestore was called correctly
    expect(admin.firestore().collection).toHaveBeenCalledWith('Users');
    expect(admin.firestore().doc).toHaveBeenCalledWith('gy733839ork');
    expect(admin.firestore().doc().update).toHaveBeenCalledWith({
      friendIds: admin.firestore.FieldValue.arrayRemove('fyet67ure74'),
    });
    expect(admin.firestore().doc).toHaveBeenCalledWith('fq6ey8iroi24');
    expect(admin.firestore().doc().update).toHaveBeenCalledWith({
      friendIds: admin.firestore.FieldValue.arrayRemove('yasftr6wqy8i9e'),
    });
    expect(admin.firestore().doc().collection).toHaveBeenCalledWith('FriendRequests');
    expect(admin.firestore().doc().collection().doc).toHaveBeenCalledWith('yr62trt27trq');
    expect(admin.firestore().doc().collection().doc().delete).toHaveBeenCalled();
    expect(admin.firestore().doc().collection().doc).toHaveBeenCalledWith('e6tujnfjw8iru');
    expect(admin.firestore().doc().collection().doc().delete).toHaveBeenCalled();

    // Check if the response was sent correctly
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Friend with id gfy7ey7t83i removed' });
  });

  it('should handle errors', async () => {
    // Mock Firestore interaction to throw an error
    admin.firestore().doc().update.mockRejectedValue(new Error('Firestore error'));

    // Call the function with mocked dependencies
    await removeFriend(req, res);

    // Check if the function handled errors correctly
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while removing friend' });
  });
});
