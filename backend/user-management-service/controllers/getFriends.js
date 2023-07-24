import { v4 as uuidv4 } from 'uuid';
import admin from "firebase-admin";
import { messaging } from "../server.js";
import User from '../data-access/models/user.table.js';
import Friend_request from '../data-access/models/friend_request.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';

let users = [];

export const getFriends = async (req, res) => {
    try {
        const { userId } = req.params;
    
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
          return res.status(200).json({ friends: [] });
        }
    
        // Get the friend documents based on the friendIds
        const friendDocs = await admin
          .firestore()
          .collection('Users')
          .where(admin.firestore.FieldPath.documentId(), 'in', friendIds)
          .get();
    
        // Extract the friend data from the friend documents
        const friends = friendDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
    
        res.status(200).json({ friends });
      } catch (error) {
        console.error('Error getting friends:', error);
        res.status(500).json({ error: 'An error occurred while getting friends' });
      }
}

