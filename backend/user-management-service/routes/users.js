import express from 'express';
import { getUsers,
        getUser,
        createUser,
        updateUser,
        deleteUser,
        getFriends,
        getFriend,
        sendFriendRequest,
        removeFriend,
        acceptFriendRequest,
        rejectFriendRequest,
        searchUser,
        isFriend,
        signInWithProvider,
        saveUserLocation
    } from '../controllers/index.js';

const router = express.Router();

// Get all users
router.get('/', getUsers);

// Search users
router.get('/search', searchUser);

// create new user
router.post('/', createUser);

// get all friends of user

// save longitude and latitude of user
router.post('/:userId/location', saveUserLocation);

router.get('/:userId/friends', getFriends);

// sign in with provider
router.patch('/:userId/signInWithProvider', signInWithProvider);

// get specified friend
router.get('/:userId/friends/:requestId', getFriend);

// getFriendship status
router.get('/:userId/isFriend/:requestId', isFriend)

// send friend request
router.post('/:userId/friend-requests/:requestId', sendFriendRequest);

// Accept friend request
router.post('/:userId/friend-requests/:requestId/accept', acceptFriendRequest);

// Reject friend request
router.post('/:userId/friend-requests/:requestId/reject', rejectFriendRequest);

// remove specified friend
router.delete('/:userId/friends/:requestId', removeFriend);

// get user with specifiedd id
router.get('/:userId', getUser);

// update existing user
router.patch('/:userId', updateUser);

// delete specified user
router.delete('/:userId', deleteUser);


export default router;