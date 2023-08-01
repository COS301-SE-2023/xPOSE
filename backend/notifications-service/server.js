const admin = require('firebase-admin');
const { createUser } = require('../path/to/createUser'); // Replace with the correct path to the function
const { Sequelize } = require('sequelize-mock');

// Mock Firebase Authentication functions
jest.mock('firebase-admin', () => {
  const auth = jest.fn();
  auth.createUser = jest.fn();
  return {
    auth: jest.fn(() => auth),
  };
});

// Mock the User model using sequelize-mock
jest.mock('../data-access/models/user.table.js', () => {
  const { MockModel } = require('sequelize-mock');
  return {
    create: jest.fn(),
  };
});

describe('createUser', () => {
  let req;
  let res;

  beforeEach(() => {
    // Initialize req and res objects for each test
    req = {
      body: {
        displayName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        emailVerified: false,
        privacy: 'public',
        bio: 'Test bio',
        photoURL: 'https://example.com/profile.jpg',
        visibility: 'visible',
      },
    };

    res = {
      send: jest.fn(),
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    const mockUid = 'mock-uid';
    const mockGeneratedUsername = 'TestUserABC123';

    // Mock uuidv4 to always return the same uid
    jest.mock('uuid', () => ({ v4: () => mockUid }));

    // Mock generateRandomAlphanumeric to always return the same value
    jest.mock('./generateRandomAlphanumeric', () => () => 'ABC123');

    // Mock Firebase createUser to resolve successfully
    admin.auth().createUser.mockResolvedValue();

    // Mock User.create to resolve successfully
    User.create.mockResolvedValue({});

    // Call the function with mocked dependencies
    await createUser(req, res);

    // Check if the user was added to the database and Firebase
    expect(User.create).toHaveBeenCalledWith({ firebase_doc_ref: mockUid });
    expect(admin.auth().createUser).toHaveBeenCalledWith({
      uid: mockUid,
      email: 'test@example.com',
      password: 'password123',
    });

    // Check if the response was sent correctly
    expect(res.send).toHaveBeenCalledWith({
      message: `User with the name Test User added to the DB`,
    });
  });

  it('should handle errors', async () => {
    // Mock Firebase createUser to throw an error
    admin.auth().createUser.mockRejectedValue(new Error('Firebase error'));

    // Call the function with mocked dependencies
    await createUser(req, res);

    // Check if the function handled the error correctly
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error ocurred while creating user',
    });
  });
});
