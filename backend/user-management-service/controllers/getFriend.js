import { v4 as uuidv4 } from 'uuid';
import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import Friend_request from '../data-access/models/friend_request.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';
import { Op } from "sequelize";

let users = [];

export const getFriend = async (req, res) => {
    try {
        const {userId, requestId} = req.params;

          // Check if there is a friendship entry between both users
          const friendship = await Friendship.findOne({
            where: {
              [Op.or]: [
                    { friend_a_id: userId, friend_b_id: requestId },
                    { friend_a_id: requestId, friend_b_id: userId },
                ],
            },
        });

        if (!friendship || friendship.length === 0) {
          return res.status(200).json({ areFriends: false });
        }
        // They are friends return document
        // Get the user 
        document
        const userDoc = await admin.firestore().collection('Users').doc(requestId).get();
        // Check if the user exists
        if (!userDoc.exists) {
          return res.status(404).json({ error: 'User not found' });
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
