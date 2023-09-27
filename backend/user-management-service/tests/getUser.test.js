import { expect } from 'chai';
import sinon from 'sinon';
import { getUser } from '../controllers/getUser.js'; // Adjust the path accordingly
import Friendship from '../data-access/models/friendship.table.js';

describe('getUser', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: { userId: 'user123' },
      query: { requestId: 'friend456' }
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
  });

  it('should return user data and areFriends: true if they are friends', async () => {
    // Mock the findOne method of Friendship to simulate being friends
    sinon.stub(Friendship, 'findOne').resolves({});

    // Mock the Firebase doc.get method to simulate user data
    const userDocData = { name: 'John Doe', email: 'john@example.com' };
    const userDocGet = sinon.stub().resolves({ data: () => userDocData });
    const userRef = { get: userDocGet };
    sinon.stub(admin.firestore().collection('Users'), 'doc').returns(userRef);

    await getUser(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ ...userDocData, areFriends: true })).to.be.true;
  });

  it('should return 404 if user is not found', async () => {
    sinon.stub(Friendship, 'findOne').resolves(null);

    const userRef = { get: sinon.stub().resolves({ exists: false }) };
    sinon.stub(admin.firestore().collection('Users'), 'doc').returns(userRef);

    await getUser(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ error: 'User not found' })).to.be.true;
  });

  it('should handle errors and return 500', async () => {
    sinon.stub(Friendship, 'findOne').rejects(new Error('Database error'));

    const userRef = { get: sinon.stub().rejects(new Error('Firebase error')) };
    sinon.stub(admin.firestore().collection('Users'), 'doc').returns(userRef);

    await getUser(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ error: 'Internal Server Error' })).to.be.true;
  });
});
