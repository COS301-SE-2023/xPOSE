import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import Friend_request from '../data-access/models/friend_request.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';


export const searchUser = async (req, res) => {
    const db = admin.firestore();
    const usersCollectionRef = db.collection("Users")

}