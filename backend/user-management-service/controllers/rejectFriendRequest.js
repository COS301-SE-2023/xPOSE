import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import Friend_request from '../data-access/models/friend_request.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';

export const rejectFriendRequest = async (req, res) => {
    try {
        const { userId, requestId } = req.params;
        // Check if the user document exists
        const userDoc = await admin.firestore().collection('Users').doc(userId).get();
        if (!userDoc.exists) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Check if the friend request document exists
        const friendRequestDoc = await admin
          .firestore()
          .collection('Users')
          .doc(requestId)
          .collection('FriendRequests')
          .doc(userId)
          .get();
    
        if (!friendRequestDoc.exists) {
          return res.status(404).json({ error: 'Friend request not found' });
        }
    
        // Delete the friend request document
        await admin
          .firestore()
          .collection('Users')
          .doc(requestId)
          .collection('FriendRequests')
          .doc(userId)
          .delete();

        // Remove requestId from the friendIds array in the sender's document
            await admin.firestore().collection('Users').doc(userId).update({
                friendIds: admin.firestore.FieldValue.arrayRemove(requestId)
        });

        // Remove userId from the friendIds array in the recipient's document
           await admin.firestore().collection('Users').doc(requestId).update({
            friendIds: admin.firestore.FieldValue.arrayRemove(userId)
        });

        res.status(200).json({ message: `Friend request from user with ID ${userId} rejected` });
     
    } catch (error) {
        console.error('Error rejecting friend request:', error);
        res.status(500).json({ error: 'An error occurred while rejecting friend request' });
      }
}
