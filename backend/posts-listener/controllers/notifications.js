import express from 'express';
import { receiveMessageFromQueue } from '../receiver.js';
import admin from "firebase-admin";
import{ user, event, post , posttaggeduser, collections, postscollection} from '../db_connector.js';


async function processReceivedMessage() {
    try{
        const queueName = 'posts-queue';
        const receivedMsg = await receiveMessageFromQueue(queueName);
        if(receivedMsg !== null){
            console.log("Received message:", receivedMsg);
            console.log(receivedMsg.data.values);
            console.log(handleNotification(receivedMsg));
            console.log("=========Deleting user==================");
            
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

export async function handleNotification(message) {
   const deleted_user_id = message.data.values[0].deleted_user_id;

    // delete post 
    // 1)Go to post table and  get all Event_ids and posts where post_ownwer_id == user_id deleted
    // 2) Go to event

    try {
        // Find all posts that match deleted user_id
        const postsToDelete = await post.findAll({
            where: {
              post_owner_uid_id: deleted_user_id
            },
          });
          console.log("=========postsToDelete=================");
          console.log(postsToDelete);

        if (postsToDelete.length === 0) {
            console.log("============NO POSTS FOUND====", postsToDelete);
            return { message: 'No posts found for the user.' };
        }

        console.log("=============Posts to delete====", postsToDelete);

        const deletedPostIds = [];
        for (const post of postsToDelete) {
            const {event_eid_id, pid} = post;
            console.log("Posts to delete", post);
            const postRef = admin.firestore().doc(`Event-Posts/${event_eid_id}/posts/${pid}`);
            await postRef.delete();
            deletedPostIds.push(pid);
        }
        
        // // Delete the posts
        // await Post.destroy({
        //     where: {
        //     post_owner_uid_id: user_id,
        //     },
        // });

        console.log("=========Deleting user==================");
          // Delete the user from the User table
        await user.destroy({
            where: {
            uid: deleted_user_id
            },
        })
        
        return { message: 'Deleted posts and corresponding Firebase records.', deletedPostIds };
    } catch(error) {
        console.log("Something went wrong", error);
    }
}

const service = express.Router();

export default service;