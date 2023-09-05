import User from '../data-access/models/user.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';
import MessageBuilder from './messagebuilder.js';
import admin from "firebase-admin";

export const acceptFriendRequest = async (req, res) => {
    const  {requestId} = req.params;
    const {senderId: requestSenderId, notificationId: notificationUid}  = req.body;

    // console.log("Req.body::::::", req.body);
    try {

        const sender = await User.findByPk(requestSenderId);
        const receiver = await User.findByPk(requestId);
      
        if (!sender || !receiver) {
            return res.status(404).json({ error: 'Friend request not found' });
        }

        await Friendship.create({
            userID1: requestSenderId,
            userID2: requestId,
            Status: "accepted"
        });
        
        const user = await User.findByPk(requestId, {
            attributes:['userName']
        });

        console.log("RequestId::::::::",requestId);
        console.log("NotifificationUID:::::::", notificationUid);

        // delete this users notification document
        const db = admin.firestore();
        const notificationRef = db.collection("Notifications").doc(requestId).collection("MyNotifications").doc(notificationUid);

    
        // Delete the notification document
        try {
            await notificationRef.delete();
            console.log(`Notification document with ID ${notificationUid} successfully deleted`);
        } catch(error){
            console.error(`Error deleting notification document with ID ${notificationUid}:`, error);
        }

        // send a notification to user
          // Communicate with the notification service


        const queueName = 'notifications';
        const message = new MessageBuilder()
                .setType("friend_accept")
                .setMessage(`${user.userName} accepted your request`)
                .setSenderId(requestId)
                .setReceiverId(requestSenderId)
                .build();

        sendMessageToQueue(queueName, message);

        res.status(200).json({ message:`Friend with ${requestSenderId} accepted friend request`});
    } catch(error){
        console.error('Error accepting friend request:', error);
        res.status(500).json({ error: 'An error occurred while acepting friend request' });  
    }
}


