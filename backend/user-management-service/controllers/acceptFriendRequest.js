import User from '../data-access/models/user.table.js';
import Friend_request from '../data-access/models/friend_request.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';
import MessageBuilder from './messagebuilder.js';
import admin from "firebase-admin";
import { Op } from "sequelize";

export const acceptFriendRequest = async (req, res) =>{
    const  {requestId} = req.params;
    const {senderId: requestSenderId, notificationUid_: notificationId}  = req.body;

    try {
        // retrieve friend request details
        const friendRequest = await Friend_request.findOne({
            where: /*{*/
                // [Op.or]: [
                    { friend_a_id: requestSenderId, friend_b_id: requestId }
                   // { friend_a_id: requestId, friend_b_id: requestSenderId },
                    // {friend_a_id: requestId},
                    // {friend_b_id: requestSenderId},
                // ]
            // }
        });


        // user does not exist in the table
        if(!friendRequest || friendRequest.length === 0) {
            return res.status(404).json({ error: 'Friend request not found' });
        }

        // Determine which user initiated the friend request and who received it
        const senderId = friendRequest.friend_a_id;
        const receiverId = friendRequest.friend_b_id;

        // Create a new entry in the Friendship table
        await Friendship.create({
            friend_a_id: senderId,
            friend_b_id: receiverId
        });

        /*const db = admin.firestore();
        const notificationRef = db.collection('Notifications').doc(senderId);
        // Get the reference to the existing document in the MyNotifications subcollection
        const myNotificationRef = notificationRef.collection('MyNotifications').doc(notificationId);
        
        // Update the status field to "processed"
        myNotificationRef.update({ "status": "processed" })
            .then(() => {
                console.log("Status updated to processed successfully!");
            })
            .catch((error) => {
                console.error("Error updating status: ", error);
            });*/

         // Delete the friend request
         await friendRequest.destroy();

         
        // send a notification to user
          // Communicate with the notification service

      const queueName = 'notifications';
      const message = new MessageBuilder()
                .setType("friend_accept")
                .setMessage(`Friend request accepted`)
                .setSenderId(senderId)
                .setReceiverId(requestSenderId)
                .build();

        sendMessageToQueue(queueName, message);

        res.status(200).json({ message:`Friend with ${requestId} accepted friend request`});
    } catch(error){
        console.error('Error accepting friend request:', error);
        res.status(500).json({ error: 'An error occurred while acepting friend request' });  
    }
}


