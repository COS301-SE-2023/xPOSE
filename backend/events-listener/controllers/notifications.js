import express from 'express';
import { receiveMessageFromQueue } from '../receiver.js';
import admin from "firebase-admin";

async function processReceivedMessage() {
    try{
        const queueName = 'events-queue';
        const receivedMsg = await receiveMessageFromQueue(queueName);
        if(receivedMsg !== null){
            console.log("Received message:", receivedMsg);
            // handleNotification(receivedMsg);
            
        }else {
            console.log("No messages received...");
        }

    } catch(error){
        console.error("Error while receiving message", error);
    }
}

processReceivedMessage();
// Set up an interval to periodically check for new messages in the queue
const intervalTime = 10000; // 5 seconds (adjust this as needed)
setInterval(processReceivedMessage, intervalTime);

export function handleNotification(message) {
    console.log("Listening to incoming messages...")
    
    // Extract required data from the message
    const {data } = message;
    // Store the message in the Notification collection
    const db = admin.firestore();
    const notificationRef = db.collection('Notifications').doc(data.receiverId);
    // Store the message in the MyNotifications subcollection
    notificationRef.collection('MyNotifications').add({
        ...data, notificationId:''})
            .then((docRef)=> {
                console.log("Notification sent successfully!");
                
                return docRef.update({
                    notificationId: docRef.id
                })
           
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
  }

const service = express.Router();

export default service;