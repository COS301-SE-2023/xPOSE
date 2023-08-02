import { updateUser } from './updateUser';
import admin from 'firebase-admin';


jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: (collectionName) => ({
      doc: (docId) => ({
        get: () =>
          Promise.resolve({
            exists: docId === 'existingUserId',
          }),
        update: jest.fn(() => Promise.resolve()),
      }),
    }),
  }),
}));

describe('updateUser', () => {
  test('should update the user document with valid fields', async () => {
    const req = {
      params: {
        userId: 'yb6gGaZNj9KrCkeDP',
      },
      body: {
        displayName: 'John Doe',
        photoURL: 'https://www.shutterstock.com/shutterstock/photos/767464168/display_1500/stock-photo-portrait-of-thoughtful-african-american-female-looks-pensively-aside-with-dreamful-expression-767464168.jpg',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await updateUser(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('User with the id yb6gGaZNj9KrCkeDP has been updated');

    
    expect(admin.firestore().collection().doc().update).toHaveBeenCalledWith({
      displayName: 'John Doe',
      photoURL: 'https://www.shutterstock.com/shutterstock/photos/767464168/display_1500/stock-photo-portrait-of-thoughtful-african-american-female-looks-pensively-aside-with-dreamful-expression-767464168.jpg',
    });
  });

  test('should return 404 when the user document does not exist', async () => {
    const req = {
      params: {
        userId: 'nonExistingUserId',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateUser(req, res);

    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  test('should return 500 for any unexpected error', async () => {
    const req = {
      params: {
        userId: 'yb6gGaZNj9KrCkeDP',
      },
      body: {
        displayName: 'John Doe',
        photoURL: 'https://www.shutterstock.com/shutterstock/photos/767464168/display_1500/stock-photo-portrait-of-thoughtful-african-american-female-looks-pensively-aside-with-dreamful-expression-767464168.jpg',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

   
    const errorMessage = 'Something went wrong';
    admin.firestore().collection().doc().update.mockRejectedValue(new Error(errorMessage));

    await updateUser(req, res);

   
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'An Error ocurred while updating the user',
    });
  });
});
