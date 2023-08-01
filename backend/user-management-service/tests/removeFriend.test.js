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
        userId: 'mock-user-id',
        requestId: 'mock-request-id',
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
    expect(admin.firestore().doc).toHaveBeenCalledWith('mock-user-id');
    expect(admin.firestore().doc().update).toHaveBeenCalledWith({
      friendIds: admin.firestore.FieldValue.arrayRemove('mock-request-id'),
    });
    expect(admin.firestore().doc).toHaveBeenCalledWith('mock-request-id');
    expect(admin.firestore().doc().update).toHaveBeenCalledWith({
      friendIds: admin.firestore.FieldValue.arrayRemove('mock-user-id'),
    });
    expect(admin.firestore().doc().collection).toHaveBeenCalledWith('FriendRequests');
    expect(admin.firestore().doc().collection().doc).toHaveBeenCalledWith('mock-request-id');
    expect(admin.firestore().doc().collection().doc().delete).toHaveBeenCalled();
    expect(admin.firestore().doc().collection().doc).toHaveBeenCalledWith('mock-user-id');
    expect(admin.firestore().doc().collection().doc().delete).toHaveBeenCalled();

    // Check if the response was sent correctly
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Friend with id mock-request-id removed' });
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
