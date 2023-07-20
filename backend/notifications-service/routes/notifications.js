import express from 'express';
// import { } from '../controllers/notifications.js';

import RabbitMQConsumer from  '../../message broker/receiver.js';
(async () => {
      const consumer = new RabbitMQConsumer('notificationsQueue');
      try {
          await consumer.connect();
          console.log('Notification service Waiting for messages...');
    
          consumer.consume((message) => {
              console.log('Received message:', message);
              // Add your logic to process the message here
          });
    
          // Keep the consumer running indefinitely, or you can set a timeout to close the connection.
      } catch (error) {
          console.error('Error:', error);
      }
    })();

const router = express.Router();

// Get all users
router.get('/', function(req, res){
    console.log("All notifications up and running");
    res.send({message:"All notifications up and running"});
});

// // create new user
// router.post('/', createUser);

// // get all friends of user
// router.get('/:userId/friends', getFriends);

// // get specified friend
// router.get('/:userId/friends/:requestId', getFriend);

// // send friend request
// router.post('/:userId/friend-requests/:requestId', sendFriendRequest);

// // Accept friend request
// router.post('/:userId/friend-requests/:requestId/accept', acceptFriendRequest);

// // Reject friend request
// router.post('/:userId/friend-requests/:requestId/reject', rejectFriendRequest);

// // remove specified friend
// router.delete('/:userId/friends/:requestId', removeFriend);

// // get user with specifiedd id
// router.get('/:userId', getUser);

// // update existing user
// router.patch('/:userId', updateUser);

// // delete specified user
// router.delete('/:userId', deleteUser);




export default router;