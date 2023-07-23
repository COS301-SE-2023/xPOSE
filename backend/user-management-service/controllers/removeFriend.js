import admin from "firebase-admin";
import { messaging } from "../server.js";
import User from '../data-access/models/user.table.js';
import Friend_request from '../data-access/models/friend_request.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';

export const removeFriend = async (req, res) => {
    try {
        const { userId, requestId } = req.params;

        // Remove the friendIds from both users
        await admin.firestore().collection('Users').doc(userId).update({
            friendIds: admin.firestore.FieldValue.arrayRemove(requestId)
        });

        await admin.firestore().collection('Users').doc(requestId).update({
            friendIds: admin.firestore.FieldValue.arrayRemove(userId)
        });

        // Remove the friend requests subcollections
        await admin.firestore().collection('Users').doc(userId).collection('FriendRequests').doc(requestId).delete();
        await admin.firestore().collection('Users').doc(requestId).collection('FriendRequests').doc(userId).delete();

        res.status(200).json({ message: `Friend with id ${requestId} removed`});
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ error: 'An error occurred while removing friend' });
    }
}




