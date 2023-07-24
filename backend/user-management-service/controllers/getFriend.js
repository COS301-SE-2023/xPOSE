import { v4 as uuidv4 } from 'uuid';
import admin from "firebase-admin";
import { messaging } from "../server.js";
import User from '../data-access/models/user.table.js';
import Friend_request from '../data-access/models/friend_request.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';

let users = [];

export const getFriend = async (req, res) => {
    try {
        const { userId, requestId } = req.params;
    
        // Get the user document
        const userDoc = await admin.firestore().collection('Users').doc(userId).get();
    
        // Check if the user exists
        if (!userDoc.exists) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Retrieve the friendIds array from the user document
        const { friendIds } = userDoc.data();
    
        // Check if the friendIds array is empty
        if (!friendIds || friendIds.length === 0) {
          return res.status(404).json({ error: 'No friends found' });
        }
    
        // Check if the specified friend ID exists in the friendIds array
        if (!friendIds.includes(requestId)) {
          return res.status(404).json({ error: `Friend with ID ${requestId} not found` });
        }

        // Get the friend document based on the friend ID
        const friendDoc = await admin.firestore().collection('Users').doc(requestId).get();

         // Check if the friend document exists
        if (!friendDoc.exists) {
            return res.status(404).json({ error: 'Friend document not found' });
        }
  
        const friendData = friendDoc.data();
        res.status(200).json({ friend: friendData });

      } catch (error) {
        console.error('Error getting friend:', error);
        res.status(500).json({ error: 'An error occurred while getting friend' });
      }
}
