import admin from 'firebase-admin';
import { createUser } from '../controllers/createUser.js'; // Replace with the correct path to the function
import { MockModel } from 'sequelize-mock';
import { v4 as uuidv4 } from 'uuid';

// Mock Firebase Authentication functions
jest.mock('firebase-admin', () => {
  const auth = jest.fn();
  auth.createUser = jest.fn();
  return {
    auth: jest.fn(() => auth),
    firestore: () => ({
      collection: () => ({
        doc: () => ({
          set: jest.fn(),
        }),
      }),
    }),
  };
});

// Mock the User model using sequelize-mock
jest.mock('../data-access/models/user.table.js', () => {
  const UserMock = new MockModel();
  return UserMock;
});

// Mock the sendMessageToQueue function from sender.js
jest.mock('../sender.js', () => ({
  sendMessageToQueue: jest.fn(),
}));

// Mock the generateRandomAlphanumeric function
jest.mock('./generateRandomAlphanumeric.js', () => () => 'ABC123');

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
    jest.spyOn(uuidv4, 'mockReturnValue').mockReturnValue(mockUid);

    // Mock Firebase createUser to resolve successfully
    admin.auth().createUser.mockResolvedValue();

    // Call the function with mocked dependencies
    await createUser(req, res);

    // Check if the user was added to the database and Firebase
    expect(admin.auth().createUser).toHaveBeenCalledWith({
      uid: mockUid,
      email: 'test@example.com',
      password: 'password123',
    });
    expect(admin.firestore().collection('Users').doc).toHaveBeenCalledWith(mockUid);
    expect(admin.firestore().collection('Users').doc().set).toHaveBeenCalledWith({
      displayName: 'Test User',
      uniq_username: mockGeneratedUsername,
      email: 'test@example.com',
      emailVerified: false,
      privacy: 'public',
      bio: 'Test bio',
      photoURL: 'https://example.com/profile.jpg',
      uid: mockUid,
      visibility: 'visible',
    });

    // Check if the User.create was called
    expect(User.create).toHaveBeenCalledWith({ firebase_doc_ref: mockUid });

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
