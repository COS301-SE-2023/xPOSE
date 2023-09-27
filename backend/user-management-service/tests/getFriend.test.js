// getFriend.test.js

import { getFriend } from '../controllers/getFriend';
import * as admin from 'firebase-admin';
import Friendship from '../data-access/models/friendship.table.js';

jest.mock('../data-access/models/friendship.table.js', () => ({
  findOne: jest.fn(),
}));

jest.mock('firebase-admin', () => ({
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
      })),
    })),
  })),
}));

describe('getFriend', () => {
  const mockRequest = {
    params: {
      userId: 'mockUserId',
      requestId: 'mockRequestId',
    },
  };

  const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if friendship is not found', async () => {
    Friendship.findOne.mockResolvedValue(null);

    await getFriend(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ areFriends: false });
  });

  it('should return friend data if friendship is found', async () => {
    const mockFriendData = { name: 'Mock Friend' };
    const mockUserDoc = { exists: true, data: jest.fn().mockReturnValue(mockFriendData) };
    const mockFriendDoc = { exists: true, data: jest.fn().mockReturnValue(mockFriendData) };

    Friendship.findOne.mockResolvedValue(true);
    admin.firestore().collection().doc().get.mockResolvedValue(mockUserDoc);
    admin.firestore().collection().doc().get.mockResolvedValue(mockFriendDoc);

    await getFriend(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ friend: mockFriendData });
  });

  // Add more test cases for error scenarios and edge cases

  // ...

});
