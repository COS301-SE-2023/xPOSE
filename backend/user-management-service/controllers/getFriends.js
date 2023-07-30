import { v4 as uuidv4 } from 'uuid';
import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import Friend_request from '../data-access/models/friend_request.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';
import { Op } from 'sequelize';

let users = [];

export const getFriends = async (req, res) => {
    try {
        const { userId } = req.params;
    
      // check if user existis in the database using Sequelize
      const user =  await User.findAll({
        where: {firebase_doc_ref: userId},
      });

      if(!user || user.length === 0) {
        return res.status(404).json({message: 'User not found'});
      }

      // fetch friends form teh friendship table using sequelize

      const friendIds = await Friendship.findAll({
        where: {
          [Op.or]: [{friend_a_id: userId},
          {friend_b_id: userId} ]
        }
      });

      // declare array to store friend documents

      const friends = [];

      // get the friend documents from firestore based on ref/id
      for(const friendId of friendIds) {
        const friendDoc = await admin.firestore().collection('Users').doc(friendId).get();

        if(friendDoc.exists){
          friends.push({
            ... friendDoc.data()
          });
        }
      }

      res.status(200).json({friends});
      } catch (error) {
        console.error('Error getting friends:', error);
        res.status(500).json({ error: 'An error occurred while getting friends' });
      }
}

