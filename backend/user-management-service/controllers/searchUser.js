import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import Friend_request from '../data-access/models/friend_request.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';


export const searchUser = async (req, res) => {
    const {fields, values} = req.query;

    if (!fields || !values || !Array.isArray(fields) || !Array.isArray(values) || fields.length !== values.length) {
        return res.status(400).json({ error: "Invalid parameters" });
      }


    const db = admin.firestore();
    const usersCollectionRef = db.collection("Users");

    try {
        let query = usersCollectionRef;
        // Construct a complex query with multiple conditions for each field-value pair
        for (let i = 0; i < fields.length; i++) {
          query = query.where(fields[i], "==", values[i]);
        }
    
        const snapshot = await query.get();
    

        if(snapshot.empty) {
            return res.status(404).json({message: "No matching users found"});
        }

        const users = [];
        snapshot.forEach((doc) => {
            users.push({id: doc.id, ...doc.data()});
        });

        return res.status(200).json(users);
    } catch(error) {
        console.error("Error searching users:", error);
        return res.status(5000).json({error: "Internal server error"});
    }

}