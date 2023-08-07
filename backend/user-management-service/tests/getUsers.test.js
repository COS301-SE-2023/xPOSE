import { getUsers } from './getUsers';
import admin from 'firebase-admin';


jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: () => ({
      get: () =>
        Promise.resolve({
          forEach: (callback) => {
            const fakeUserData = [
              { name: 'dyhgyguhw8ure9' },
              { name: 'hwguhfiunwifgi' },
              { name: 'yegw939jpojfoe' },
            ];
            fakeUserData.forEach((user) => callback({ data: () => user }));
          },
        }),
    }),
  }),
}));

describe('getUsers', () => {
  beforeEach(() => {
    
    users = [];
  });

  test('should return an array of users', async () => {
    const req = {};
    const res = {
      json: jest.fn(),
    };

    await getUsers(req, res);

    expect(res.json).toHaveBeenCalledWith([
      { name: 'dyhgyguhw8ure9' },
      { name: 'hwguhfiunwifgi' },
      { name: 'yegw939jpojfoe' },
    ]);
  });

  test('should return an empty array if there are no users', async () => {
    const req = {};
    const res = {
      json: jest.fn(),
    };

    const db = {
      collection: () => ({
        get: () => Promise.resolve({ forEach: () => {} }),
      }),
    };

    jest.mock('firebase-admin', () => ({
      firestore: () => db,
    }));

    await getUsers(req, res);

    
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('should return 500 for any unexpected error', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const errorMessage = 'Something went wrong';
    const db = {
      collection: () => ({
        get: () => Promise.reject(new Error(errorMessage)),
      }),
    };

    jest.mock('firebase-admin', () => ({
      firestore: () => db,
    }));

    await getUsers(req, res);

    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
