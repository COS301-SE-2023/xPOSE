import admin from "firebase-admin";
import { acceptFriendRequest } from "../controllers/acceptFriendRequest.js"; // Replace with the correct path to the function
import { Sequelize } from "sequelize-mock";

// Mock Firebase Authentication functions
jest.mock("firebase-admin", () => {
  const auth = jest.fn();
  auth.auth = jest.fn();
  return {
    auth: jest.fn(() => auth),
  };
});

// Mock the Friend_request and Friendship models using sequelize-mock
jest.mock("../data-access/models/friend_request.table.js", () => {
  const { MockModel } = require("sequelize-mock");
  return {
    findOne: jest.fn(),
  };
});

jest.mock("../data-access/models/friendship.table.js", () => {
  const { MockModel } = require("sequelize-mock");
  return {
    create: jest.fn(),
  };
});

// Mock the sendMessageToQueue function from the sender.js
jest.mock("../sender.js", () => {
  return {
    sendMessageToQueue: jest.fn(),
  };
});

describe("acceptFriendRequest", () => {
  let req;
  let res;

  beforeEach(() => {
    // Initialize req and res objects for each test
    req = {
      params: {
        requestId: "mock-request-id",
      },
      body: {
        senderId: "mock-sender-id",
        notificationUid_: "mock-notification-id",
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

  it("should accept a friend request", async () => {
    const mockFriendRequest = {
      friend_a_id: "mock-sender-id",
      friend_b_id: "mock-request-id",
      destroy: jest.fn(),
    };

    // Mock Friend_request.findOne to resolve successfully
    Friend_request.findOne.mockResolvedValue(mockFriendRequest);

    // Mock Friendship.create to resolve successfully
    Friendship.create.mockResolvedValue({});

    // Call the function with mocked dependencies
    await acceptFriendRequest(req, res);

    // Check if the Friendship was created and Friend_request was destroyed
    expect(Friendship.create).toHaveBeenCalledWith({
      friend_a_id: "mock-sender-id",
      friend_b_id: "mock-request-id",
    });
    expect(mockFriendRequest.destroy).toHaveBeenCalled();

    // Check if the response was sent correctly
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Friend with mock-request-id accepted friend request",
    });
  });

  it("should handle friend request not found", async () => {
    // Mock Friend_request.findOne to return null (friend request not found)
    Friend_request.findOne.mockResolvedValue(null);

    // Call the function with mocked dependencies
    await acceptFriendRequest(req, res);

    // Check if the function handled the not found case correctly
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Friend request not found" });
  });

  it("should handle errors", async () => {
    // Mock Friend_request.findOne to throw an error
    Friend_request.findOne.mockRejectedValue(new Error("Database error"));

    // Call the function with mocked dependencies
    await acceptFriendRequest(req, res);

    // Check if the function handled the error case correctly
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while accepting friend request",
    });
  });
});
