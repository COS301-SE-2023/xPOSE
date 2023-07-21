import express from 'express';
import { receiveMessageFromQueue } from '../receiver.js';
import admin from "firebase-admin";

// import { } from '../controllers/notifications.js';

async function processReceivedMessage() {
    try{
        const queueName = 'notifications';
        const receivedMsg = await receiveMessageFromQueue(queueName);
        console.log("Received message:", receivedMsg);
        
        handleNotification(receivedMsg);
        
        /*switch (receivedMsg.type) {
            case 'notification':
                handleNotificationMessage(message);
                break;
            case 'request':
                handleRequestMessage(message);
                break;
            default:
                console.log('Received an unknown message type');
        }*/
        

    } catch(error){
        console.error("Error while receiving message", error);
    }
}

// Process message
processReceivedMessage();

export function handleNotification(message) {
    // Extract required data from the message
    const {responses, userId, data } = message;

    // Store the message in the Notification collection
    const db = admin.firestore();
    const notificationRef = db.collection('Notifications').doc(data.userId);
    // Store the message in the MyNotifications subcollection
    notificationRef.collection('MyNotifications').add(data)
            .then(()=> {
                console.log("Notification sent successfully!");
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
  }


const router = express.Router();

// router.get('/', function(req, res){
//     console.log("All notifications up and running");
//     res.send({message:"All notifications up and running"});
// });

export default router;