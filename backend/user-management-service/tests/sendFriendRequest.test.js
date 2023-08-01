import { sendFriendRequest } from '../controllers/sendFriendRequest.js'; // Replace with the correct path to the function
import { MockModel } from 'sequelize-mock';
import { sendMessageToQueue } from '../sender.js';
import MessageBuilder from './messagebuilder.js';

// Mock the Friend_request model using sequelize-mock
jest.mock('../data-access/models/friend_request.table.js', () => {
  const FriendRequestMock = new MockModel();
  return FriendRequestMock;
});

// Mock the MessageBuilder class
jest.mock('./messagebuilder.js', () => {
  return jest.fn().mockImplementation(() => ({
    setType: jest.fn().mockReturnThis(),
    setMessage: jest.fn().mockReturnThis(),
    setSenderId: jest.fn().mockReturnThis(),
    setReceiverId: jest.fn().mockReturnThis(),
    build: jest.fn(),
  }));
});

// Mock the sendMessageToQueue function
jest.mock('../sender.js', () => ({
  sendMessageToQueue: jest.fn(),
}));

describe('sendFriendRequest', () => {
  let req;
  let res;

  beforeEach(() => {
    // Initialize req and res objects for each test
    req = {
      params: {
        userId: 'mock-user-id',
        requestId: 'mock-request-id',
      },
      body: {
        username: 'mock-username',
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

  it('should send a friend request', async () => {
    // Mock Friend_request.create to resolve successfully
    Friend_request.create.mockResolvedValue({});

    // Call the function with mocked dependencies
    await sendFriendRequest(req, res);

    // Check if the Friend_request was created with the correct data
    expect(Friend_request.create).toHaveBeenCalledWith({
      friend_a_id: 'mock-user-id',
      friend_b_id: 'mock-request-id',
      response: 'pending',
    });

    // Check if the MessageBuilder was called with the correct data
    expect(MessageBuilder).toHaveBeenCalled();
    expect(MessageBuilder().setType).toHaveBeenCalledWith('friend_request');
    expect(MessageBuilder().setMessage).toHaveBeenCalledWith('Friend request from mock-username');
    expect(MessageBuilder().setSenderId).toHaveBeenCalledWith('mock-user-id');
    expect(MessageBuilder().setReceiverId).toHaveBeenCalledWith('mock-request-id');
    expect(MessageBuilder().build).toHaveBeenCalled();

    // Check if the sendMessageToQueue was called with the correct data
    expect(sendMessageToQueue).toHaveBeenCalledWith('notifications', MessageBuilder().build());

    // Check if the response was sent correctly
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Friend request sent successfully to user with id mock-request-id',
    });
  });

  it('should handle errors', async () => {
    // Mock Friend_request.create to throw an error
    Friend_request.create.mockRejectedValue(new Error('Database error'));

    // Call the function with mocked dependencies
    await sendFriendRequest(req, res);

    // Check if the function handled the error correctly
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while sending friend request',
    });
  });
});
