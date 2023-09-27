import { getFriends } from '../controllers/getFriends';
import Friendship from '../data-access/models/friendship.table.js';
import admin from "firebase-admin";

jest.mock('../data-access/models/friendship.table.js', () => ({
  Friendship: {
    findAll: jest.fn(),
  },
}));

jest.mock("firebase-admin", () => ({
  firestore: () => ({
    collection: () => ({
      doc: jest.fn(),
    }),
  }),
}));

describe('getFriends', () => {
  const mockUserId = 'Z2wxae2wxz2wA';
  const mockFriendships = [
    // Mock friendship data
    // ... 
  ];

  const mockFriendDocs = [
    // Mock friend documents from Firebase
    // ...
  ];

  const mockRequest = {
    params: {
      userId: mockUserId,
    },
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of friends', async () => {
    // Mock Friendship.findAll to return friendship data
    const findAllMock = jest.fn().mockResolvedValueOnce(mockFriendships);
    require('../data-access/models/friendship.table.js').Friendship.findAll = findAllMock;

    // Mock Firebase admin calls to simulate friend documents
    const docMock = jest.fn();
    admin.firestore().collection().doc = docMock;
    docMock.mockImplementation((friendId) => ({
      get: jest.fn(() => ({
        exists: mockFriendDocs.some(doc => doc.id === friendId),
        data: jest.fn(() => mockFriendDocs.find(doc => doc.id === friendId)),
      })),
    }));

    await getFriends(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockFriendDocs.map(doc => ({ ...doc.data() })));
  });

  it('should return a 404 error if no friends found', async () => {
    // Mock Friendship.findAll to return empty array (no friends)
    Friendship.findAll.mockResolvedValueOnce([]);

    await getFriends(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should handle errors and return a 500 status', async () => {
    const errorMessage = 'Test error message';
    jest.spyOn(console, 'error').mockImplementationOnce(() => {}); // Mock console.error

    // Mock Friendship.findAll to throw an error
    Friendship.findAll.mockRejectedValueOnce(new Error(errorMessage));

    await getFriends(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'An error occurred while getting friends' });
    expect(console.error).toHaveBeenCalledWith('Error getting friends:', expect.any(Error));
  });
});
