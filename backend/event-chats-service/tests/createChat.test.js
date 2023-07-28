const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Assuming your Express app entry point is index.js
// const admin = require('firebase-admin');
const { admin } = require('../data-access/firebase'); // Import the function to initialize Firebase app for testing
const { createChat } = require('../routes/index');

chai.use(chaiHttp);
const expect = chai.expect;
// const uid = '3dd82b11-3641-42a0-ad9c-c59049a0ee5c';
const { uid, event_id, message } = require('./data.json');

describe('Create Chat Endpoint', () => {
//   before(() => {
    // Initialize Firebase app before running tests
    // initializeFirebaseApp();
    // console.log('Testing Create Chat Endpoint');
//   });

  it('should create a new chat message', (done) => {
    chai
      .request(app)
      .post('/chats/event-id-123') // Replace event-id-123 with a valid event ID
      .query({ uid: uid }) // Replace user-123 with a valid user ID
      .send({ message: 'Test chat message' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('message', 'Test chat message');
        expect(res.body).to.have.property('uid', uid);
        done();
      });
  });

  it('should return status 500 for invalid event ID', (done) => {
    chai
      .request(app)
      .post(`/chats/invalid-event-id`) // Replace invalid-event-id with an invalid event ID
      .query({ uid: uid }) // Replace user-123 with a valid user ID
      .send({ message: 'Test chat message' })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

    // Add more test cases as needed

    after((done) => {
        // Close the server after all tests are finished
        app.close(() => {
          done();
        });
    });
});
