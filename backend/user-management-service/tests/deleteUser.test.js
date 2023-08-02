import { deleteUser } from './deleteUser';
import admin from 'firebase-admin';

jest.mock('firebase-admin', () => ({
  auth: () => ({
    deleteUser: jest.fn(() => Promise.resolve()),
  }),
  firestore: () => ({
    collection: (collectionName) => ({
      doc: (docId) => ({
        delete: jest.fn(() => Promise.resolve()),
      }),
    }),
  }),
}));

describe('deleteUser', () => {
  test('should delete the user account and document', async () => {
    const req = {
      params: {
        userId: 'userA',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await deleteUser(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('User with the id userA deleted from DB successfuly');

    
    expect(admin.auth().deleteUser).toHaveBeenCalledWith('userA');
    expect(admin.firestore().collection().doc().delete).toHaveBeenCalledWith();
  });

  test('should return 500 for any unexpected error', async () => {
    const req = {
      params: {
        userId: 'userA',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const errorMessage = 'Something went wrong';
    admin.auth().deleteUser.mockRejectedValue(new Error(errorMessage));

    await deleteUser(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while deleting the user',
    });
  });
});
