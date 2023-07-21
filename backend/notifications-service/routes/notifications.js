import express from 'express';
import { receiveMessageFromQueue } from '../receiver.js';
// import { } from '../controllers/notifications.js';

const queueName = 'notifications';
receiveMessageFromQueue(queueName);

const router = express.Router();

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