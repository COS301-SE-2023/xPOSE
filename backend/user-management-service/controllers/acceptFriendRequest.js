import User from '../data-access/models/user.table.js';
import Friend_request from '../data-access/models/friend_request.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';
import MessageBuilder from './messagebuilder.js';
import { sendMessageToQueue } from '../sender.js';

export const acceptFriendRequest = async (req, res) =>{
    try{
        const {userId, requestId} = req.params;
        
        // Get the recipient user document
        const recipientDoc = await admin.firestore().collection('Users').doc(requestId).get();

        // Check if the recipient exists
        if (!recipientDoc.exists) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

         // Check if the friend request exists and retrieve the request document
        const requestSnapshot = await admin
        .firestore()
        .collection('Users')
        .doc(requestId)
        .collection('FriendRequests')
        .doc(userId)
        .get();

        // Check if the friend request document exists
        if (!requestSnapshot.exists) {
            return res.status(404).json({ error: 'Friend request not found' });
        }

        // Update the status of the friend request to 'accepted'
        await admin
            .firestore()
            .collection('Users')
            .doc(requestId)
            .collection('FriendRequests')
            .doc(userId)
            .update({
            status: 'accepted',
        });

        // Both recipient and sender are now friends Add friend to list of friends

        // Add the new friendID to the recipient's friendIds array
        await admin
            .firestore()
            .collection('Users')
            .doc(requestId)
            .update({
            friendIds: admin.firestore.FieldValue.arrayUnion(userId),
        });

         // Add  new friendID to the sender's friendIds array
        await admin
            .firestore()
            .collection('Users')
            .doc(userId)
            .update({
            friendIds: admin.firestore.FieldValue.arrayUnion(requestId),
        });


        res.status(200).json({ message:`Friend with ${requestId} accepted friend request`});
    } catch(errror){
        console.error('Error accepting friend request:', error);
        res.status(500).json({ error: 'An error occurred while acepting friend request' });  
    }
}


