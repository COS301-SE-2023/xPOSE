import { v4 as uuidv4 } from 'uuid';
import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import Friend_request from '../data-access/models/friend_request.table.js';
import Friendship from '../data-access/models/friendship.table.js';

let users = [];
export const deleteUser = async (req, res) => {
    try {
        const {userId} = req.params;

        // Delete the user account from Firebase Authentication
        await admin.auth().deleteUser(userId);

        //delete the user document from the Users collection
        await admin.firestore().collection('Users').doc(userId).delete();
       
        res.status(200).send(`User with the id ${userId} deleted from DB successfuly`);

    } catch(error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
}







  






