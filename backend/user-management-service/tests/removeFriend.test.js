import { removeFriend } from './removeFriend';
import admin from 'firebase-admin';


jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: (collectionName) => ({
      doc: (docId) => ({
        update: jest.fn(() => Promise.resolve()),
        delete: jest.fn(() => Promise.resolve()),
      }),
    }),
    FieldValue: {
      arrayRemove: jest.fn(),
    },
  }),
}));

describe('removeFriend', () => {
  test('should remove friend and friend requests', async () => {
    const req = {
      params: {
        userId: 'userA',
        requestId: 'userB',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await removeFriend(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Friend with id userB removed',
    });

    expect(admin.firestore().collection().doc().update).toHaveBeenCalledTimes(2);
    expect(admin.firestore().FieldValue.arrayRemove).toHaveBeenCalledTimes(2);
    expect(admin.firestore().collection().doc().delete).toHaveBeenCalledTimes(2);
  });

  test('should return 500 for any unexpected error', async () => {
    const req = {
      params: {
        userId: 'userA',
        requestId: 'userB',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    
    const errorMessage = 'Something went wrong';
    admin.firestore().collection().doc().update.mockRejectedValue(new Error(errorMessage));
    admin.firestore().collection().doc().delete.mockRejectedValue(new Error(errorMessage));

    await removeFriend(req, res);

    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while removing friend',
    });
  });
});
