const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Assuming your Express app entry point is index.js
// const admin = require('firebase-admin');
const { admin } = require('../data-access/firebase'); // Import the function to initialize Firebase app for testing
const { getChats } = require('../routes/index');

const { uid, event_id } = require('./data.json');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Get Chats Endpoint', () => {
//   before(() => {
    // Initialize Firebase app before running tests
    // initializeFirebaseApp();
//   });

  it('should return an array of chats', (done) => {
    chai
      .request(app)
      .get(`/chats/${event_id}`) // Replace event-id-123 with a valid event ID
      .query({ uid: uid, after: '2023-07-01T00:00:00Z' }) // Replace user-123 and after timestamp with appropriate values
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.greaterThan(0); // Assuming there are chats available for the provided event ID
        // Add more assertions as needed for chat data
        done();
      });
  });

  it('should return status 500 for invalid event ID', (done) => {
    chai
      .request(app)
      .get('/chats/invalid-event-id') // Replace invalid-event-id with an invalid event ID
      .query({ uid: uid, after: '2023-07-01T00:00:00Z' }) // Replace user-123 and after timestamp with appropriate values
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  // Add more test cases as needed
});
