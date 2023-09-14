import { v4 as uuidv4 } from 'uuid';
import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';
import { Op } from 'sequelize';

let users = [];

export const getFriends = async (req, res) => {
    try {
      const { userId } = req.params;

      let friends = [];
      try {
         friends = await Friendship.findAll({
          where: {
            [Op.and]: [
              { [Op.not]: [{ userID1: null }] }, // Exclude rows where userID1 is null
              { [Op.not]: [{ userID2: null }] }, // Exclude rows where userID2 is null
              {
                [Op.or]: [
                  {userID1:userId},
                  {userID2: userId}
                ]
              },             
              //   { userID1: userId },
              //   { userID2: userId }
              // ],
            { Status: 'accepted'}
          ] 
          },
          include: [
            { model: User },
            { model: User }
          ]
        });
    
        // console.log("::::FRIENDS:::::", friends);
      } catch (error) {
        console.error("Error retrieving friends:", error);
        throw error;
      }

      // console.log("List of Friends::::", list_friends);
      // const list_friends = user.Friends;

      if(!friends) {
        return res.status(404).json({message: 'User not found'});
      }

      // declare array to store friend documents
      const friends_ = [];


      // get the friend documents from firestore based on ref/id
      for(const friendId of friends) {
        if(friendId.dataValues.userID2 === userId)
          var friendDoc = await admin.firestore().collection('Users').doc(friendId.dataValues.userID1).get();
        if(friendId.dataValues.userID1 === userId)
          var friendDoc = await admin.firestore().collection('Users').doc(friendId.dataValues.userID2).get();
        
        if(friendDoc.exists){
          friends_.push({
            ... friendDoc.data()
          });
        }
      }

      res.status(200).json(friends_);
      } catch (error) {
        console.error('Error getting friends:', error);
        res.status(500).json({ error: 'An error occurred while getting friends' });
      }
}

