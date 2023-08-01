import { getFriend } from './getFriend';
import admin from 'firebase-admin';


jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: (collectionName) => ({
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

describe('getFriend', () => {
  beforeEach(() => {
    
    users = [];
  });

  test('should return the friend data when they are friends', async () => {
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

    const Friendship = {
      findOne: jest.fn(() => Promise.resolve({ friend_a_id: 'userA', friend_b_id: 'userB' })),
    };


    jest.mock('../data-access/models/friendship.table.js', () => Friendship);

    await getFriend(req, res);


    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ friend: { name: 'Existing User' } });
  });

  test('should return "areFriends: false" when they are not friends', async () => {
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


    const Friendship = {
      findOne: jest.fn(() => Promise.resolve(null)),
    };


    jest.mock('../data-access/models/friendship.table.js', () => Friendship);

    await getFriend(req, res);

    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ areFriends: false });
  });

  test('should return "User not found" when the user does not exist', async () => {
    const req = {
      params: {
        userId: 'userA',
        requestId: 'nonExistingUserId',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getFriend(req, res);

   
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  test('should return "Friend document not found" when the friend document does not exist', async () => {
    const req = {
      params: {
        userId: 'userA',
        requestId: 'existingUserId', 
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getFriend(req, res);

   
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Friend document not found' });
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
    const Friendship = {
      findOne: jest.fn(() => Promise.reject(new Error(errorMessage))),
    };

   
    jest.mock('../data-access/models/friendship.table.js', () => Friendship);

    await getFriend(req, res);

  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while getting friend' });
  });
});
