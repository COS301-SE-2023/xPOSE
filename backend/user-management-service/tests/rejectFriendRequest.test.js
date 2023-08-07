import { rejectFriendRequest } from './rejectFriendRequest';
import admin from 'firebase-admin';

jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: (collectionName) => ({
      doc: (docId) => ({
        get: () => {
          if (docId === 'existingUserId') {
            return Promise.resolve({
              exists: true,
            });
          } else {
            return Promise.resolve({
              exists: false,
            });
          }
        },
        delete: jest.fn(() => Promise.resolve()),
        update: jest.fn(() => Promise.resolve()),
      }),
    }),
    FieldValue: {
      arrayRemove: jest.fn(),
    },
  }),
}));

describe('rejectFriendRequest', () => {
  test('should reject the friend request and update friendIds arrays', async () => {
    const req = {
      params: {
        userId: 'sgfeydw4f5',
        requestId: 'ygfyuueek3eb',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await rejectFriendRequest(req, res);


    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `Friend request from user with ID sgfeydw4f5 rejected`,
    });

    expect(admin.firestore().collection().doc().get).toHaveBeenCalledTimes(2);
    expect(admin.firestore().collection().doc().delete).toHaveBeenCalled();
    expect(admin.firestore().collection().doc().update).toHaveBeenCalledTimes(2);
    expect(admin.firestore().FieldValue.arrayRemove).toHaveBeenCalledTimes(2);
  });

  test('should return 404 when the user document does not exist', async () => {
    const req = {
      params: {
        userId: 'nonExistingUserId',
        requestId: 'ygfyuueek3eb',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await rejectFriendRequest(req, res);

    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  test('should return 404 when the friend request document does not exist', async () => {
    const req = {
      params: {
        userId: 'existingUserId',
        requestId: 'nonExistingRequestId',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await rejectFriendRequest(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Friend request not found' });
  });

  test('should return 500 for any unexpected error', async () => {
    const req = {
      params: {
        userId: 'sgfeydw4f5',
        requestId: 'ygfyuueek3eb',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const errorMessage = 'Something went wrong';
    admin.firestore().collection().doc().delete.mockRejectedValue(new Error(errorMessage));
    admin.firestore().collection().doc().update.mockRejectedValue(new Error(errorMessage));

    await rejectFriendRequest(req, res);

    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while rejecting friend request',
    });
  });
});
