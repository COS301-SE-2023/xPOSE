import { getFriend } from '../controllers/getFriend';
import { Friendship } from '../data-access/models/friendship.table.js';
import admin from "firebase-admin";

jest.mock('../data-access/models/friendship.table.js', () => ({
  Friendship: {
    findOne: jest.fn(),
  },
}));

jest.mock("firebase-admin", () => ({
  firestore: () => ({
    collection: () => ({
      doc: jest.fn(),
    }),
  }),
}));

describe('getFriend', () => {
  // Mock data
  const mockFriendshipData = {
    // ... mock friendship data
  };

  const mockUserData = {
    // ... mock user data
  };

  const mockRequest = {
    params: {
      userId: 'Z2wxae2wxz2wA',
      requestId: 'existingUser',
    },
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    
    jest.clearAllMocks();
  });

  it('should return friend data when friendship exists', async () => {
    // Mock Friendship.findOne to return the friendship data
    Friendship.findOne.mockResolvedValueOnce(mockFriendshipData);

    // Mock Firebase admin calls
    admin.firestore().collection().doc.mockReturnValueOnce({
      get: jest.fn().mockResolvedValueOnce({ exists: true, data: jest.fn().mockReturnValueOnce(mockUserData) }),
    });

    await getFriend(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ friend: mockUserData });
  });

  it('should return "areFriends: false" when no friendship exists', async () => {
    // Mock Friendship.findOne to return null (no friendship)
    Friendship.findOne.mockResolvedValueOnce(null);

    await getFriend(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ areFriends: false });
  });

  it('should return a 404 error if user is not found', async () => {
    // Mock Friendship.findOne to return the friendship data
    Friendship.findOne.mockResolvedValueOnce(mockFriendshipData);

    // Mock Firebase admin calls to simulate user not found
    admin.firestore().collection().doc.mockReturnValueOnce({
      get: jest.fn().mockResolvedValueOnce({ exists: false }),
    });

    await getFriend(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('should handle errors and return a 500 status', async () => {
    const errorMessage = 'Test error message';
    jest.spyOn(console, 'error').mockImplementationOnce(() => {}); // Mock console.error

    // Mock Friendship.findOne to throw an error
    Friendship.findOne.mockRejectedValueOnce(new Error(errorMessage));

    await getFriend(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'An error occurred while getting friend' });
    expect(console.error).toHaveBeenCalledWith('Error getting friend:', expect.any(Error));
  });
});
