import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';
import { Op, Sequelize } from "sequelize";

export const rejectFriendRequest = async (req, res) => {
    try {
        const { userId, requestId } = req.params;
        const {senderId: requestSenderId, notificationId: notificationUid}  = req.body;

          await Friendship.destroy({
            where: {
              [Sequelize.Op.or]: [
                {userID1: userId, userID2: requestId},
                {userID1: requestId, userID2: userId},
              ]
            }
          });
          
            // delete this users notification document
            if(!notificationUid) {
              const db = admin.firestore();
              const notificationRef = db.collection("Notifications").doc(requestId).collection("MyNotifications").doc(notificationUid);
  
              // Delete the notification document
              try {
                  await notificationRef.delete();
                  console.log(`Notification document with ID ${notificationUid} successfully deleted`);
              } catch(error){
                  console.error(`Error deleting notification document with ID ${notificationUid}:`, error);
              }
            }
         

        res.status(200).json({ message: `Friend request from user with ID ${userId} rejected` });
     
    } catch (error) {
        console.error('Error rejecting friend request:', error);
        res.status(500).json({ error: 'An error occurred while rejecting friend request' });
      }
}
