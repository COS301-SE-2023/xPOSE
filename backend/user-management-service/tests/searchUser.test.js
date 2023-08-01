import admin from 'firebase-admin';
import { searchUser } from '../path/to/searchUser'; // Replace with the correct path to the function

// Mock Firebase Firestore interactions
jest.mock('firebase-admin', () => {
  const firestore = jest.fn();
  firestore.collection = jest.fn(() => firestore);
  firestore.where = jest.fn(() => firestore);
  firestore.get = jest.fn();
  return { firestore };
});

// Mock the Friend_request and Friendship models using sequelize-mock
jest.mock('../data-access/models/user.table.js', () => {
  const { MockModel } = require('sequelize-mock');
  return new MockModel();
});

// Mock the sender.js module
jest.mock('../sender.js', () => ({
  sendMessageToQueue: jest.fn(),
}));

describe('searchUser', () => {
  let req;
  let res;

  beforeEach(() => {
    // Initialize req and res objects for each test
    req = {
      query: {
        field: 'displayName',
        value: 'John',
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

  it('should search users', async () => {
    // Mock Firestore snapshot result with data
    const mockSnapshot = {
      empty: false,
      forEach: jest.fn((callback) => {
        const data = {
          displayName: 'John Doe',
          email: 'john.doe@example.com',
        };
        callback({ id: 'user-id', data: () => data });
      }),
    };
    admin.firestore().get.mockResolvedValue(mockSnapshot);

    // Call the function with mocked dependencies
    await searchUser(req, res);

    // Check if Firestore was called correctly
    expect(admin.firestore().collection).toHaveBeenCalledWith('Users');
    expect(admin.firestore().where).toHaveBeenCalledWith('displayName', '==', 'John');
    expect(admin.firestore().get).toHaveBeenCalled();

    // Check if the response was sent correctly
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        id: 'user-id',
        displayName: 'John Doe',
        email: 'john.doe@example.com',
      },
    ]);
  });

  it('should handle no matching users', async () => {
    // Mock empty Firestore snapshot result
    const mockSnapshot = {
      empty: true,
    };
    admin.firestore().get.mockResolvedValue(mockSnapshot);

    // Call the function with mocked dependencies
    await searchUser(req, res);

    // Check if the function handled no matching users correctly
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No matching users found' });
  });

  it('should handle invalid parameters', async () => {
    // Modify the req object to have missing field/value
    req.query.field = undefined;
    req.query.value = undefined;

    // Call the function with mocked dependencies
    await searchUser(req, res);

    // Check if the function handled invalid parameters correctly
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid parameters' });
  });

  it('should handle internal server error', async () => {
    // Mock Firestore interaction to throw an error
    admin.firestore().get.mockRejectedValue(new Error('Firestore error'));

    // Call the function with mocked dependencies
    await searchUser(req, res);

    // Check if the function handled internal server error correctly
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
