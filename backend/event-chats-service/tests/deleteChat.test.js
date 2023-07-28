const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Assuming your Express app entry point is index.js
// const admin = require('firebase-admin');
const { admin } = require('../data-access/firebase'); // Import the function to initialize Firebase app for testing
const { deleteChat } = require('../routes/index');

const { uid, event_id } = require('./data.json');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Delete Chat Endpoint', () => {
//   before(() => {
    // Initialize Firebase app before running tests
//     initializeFirebaseApp();
//   });

  it('should delete a chat message', (done) => {
    // Perform the necessary setup to create a chat message for testing
    // Then use the chat ID obtained from the setup in the delete request

    chai
      .request(app)
      .delete(`/chats/${event_id}`) // Replace event-id-123 with a valid event ID
      .query({ uid: uid, chat_id: 'chat-id-123' }) // Replace user-123 and chat-id-123 with appropriate values
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ message: 'Chat deleted successfully' });
        done();
      });
  });

  it('should return status 500 for invalid event ID', (done) => {
    chai
      .request(app)
      .delete('/chats/invalid-event-id') // Replace invalid-event-id with an invalid event ID
      .query({ uid: 'user-123', chat_id: 'chat-id-123' }) // Replace user-123 and chat-id-123 with appropriate values
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  // Add more test cases as needed
});
