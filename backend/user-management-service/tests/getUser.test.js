import { getUser } from './getUser';
import admin from 'firebase-admin';


jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: () => ({
      doc: (docId) => ({
        get: () => {
          if (docId === 'existingUserId') {
            return Promise.resolve({
              exists: true,
              data: () => ({ name: 'Existing User' }),
            });
          } else {
            return Promise.resolve({
              exists: false,
            });
          }
        },
      }),
    }),
  }),
}));

describe('getUser', () => {
  test('should return user data with areFriends: true when they are friends', async () => {
    const req = {
      params: {
        userId: 'userA',
      },
      query: {
        requestId: 'userB',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

   
    const Friendship = {
      findOne: jest.fn(() => Promise.resolve({ friend_a_id: 'userA', friend_b_id: 'userB' })),
    };

   
    jest.mock('../data-access/models/friendship.table.js', () => Friendship);

    await getUser(req, res);

    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ name: 'Existing User', areFriends: true });
  });

  test('should return user data with areFriends: false when they are not friends', async () => {
    const req = {
      params: {
        userId: 'userA',
      },
      query: {
        requestId: 'userB',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const Friendship = {
      findOne: jest.fn(() => Promise.resolve(null)),
    };

   
    jest.mock('../data-access/models/friendship.table.js', () => Friendship);

    await getUser(req, res);

    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ name: 'Existing User', areFriends: false });
  });

  test('should return 404 when the requested user does not exist', async () => {
    const req = {
      params: {
        userId: 'userA',
      },
      query: {
        requestId: 'nonExistingUserId',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUser(req, res);

    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  test('should return 500 for any unexpected error', async () => {
    const req = {
      params: {
        userId: 'userA',
      },
      query: {
        requestId: 'userB',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    
    const errorMessage = 'Something went wrong';
    const Friendship = {
      findOne: jest.fn(() => Promise.reject(new Error(errorMessage))),
    };


    jest.mock('../data-access/models/friendship.table.js', () => Friendship);

    await getUser(req, res);

    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
