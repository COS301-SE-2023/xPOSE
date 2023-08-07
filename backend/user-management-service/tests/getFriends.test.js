import { getFriends } from './getFriends';
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

describe('getFriends', () => {
  beforeEach(() => {
    
    users = [];
  });

  test('should return an array of friend data when the user exists and has friends', async () => {
    const req = {
      params: {
        userId: 'Z2wxae2wxz2wA',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

   
    const User = {
      findAll: jest.fn(() => Promise.resolve([{ firebase_doc_ref: 'Z2wxae2wxz2wA' }])),
    };
    const Friendship = {
      findAll: jest.fn(() => Promise.resolve([{ friend_a_id: 'Z2wxae2wxz2wA', friend_b_id: 'userB' }])),
    };

  
    jest.mock('../data-access/models/user.table.js', () => User);
    jest.mock('../data-access/models/friendship.table.js', () => Friendship);

    await getFriends(req, res);

   
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ name: 'Existing User' }]);
  });

  test('should return an empty array when the user exists but has no friends', async () => {
    const req = {
      params: {
        userId: 'Z2wxae2wxz2wA',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    
    const User = {
      findAll: jest.fn(() => Promise.resolve([{ firebase_doc_ref: 'Z2wxae2wxz2wA' }])),
    };
    const Friendship = {
      findAll: jest.fn(() => Promise.resolve([])),
    };

    jest.mock('../data-access/models/user.table.js', () => User);
    jest.mock('../data-access/models/friendship.table.js', () => Friendship);

    await getFriends(req, res);

  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('should return 404 when the user does not exist', async () => {
    const req = {
      params: {
        userId: 'nonExistingUserId',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const User = {
      findAll: jest.fn(() => Promise.resolve([])),
    };

   
    jest.mock('../data-access/models/user.table.js', () => User);

    await getFriends(req, res);

    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('should return 500 for any unexpected error', async () => {
    const req = {
      params: {
        userId: 'Z2wxae2wxz2wA',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const errorMessage = 'Something went wrong';
    const User = {
      findAll: jest.fn(() => Promise.reject(new Error(errorMessage))),
    };

    
    jest.mock('../data-access/models/user.table.js', () => User);

    await getFriends(req, res);

    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while getting friends' });
  });
});
