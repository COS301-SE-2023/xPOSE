import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';


export const searchUser = async (req, res) => {
    const {field, value} = req.query;

    const defaultField = 'displayName'; // Default field to search by

    if(!field || !value){
        return res.status(400).json({error: "Invalid parameters"});
    }

    const db = admin.firestore();
    const usersCollectionRef = db.collection("Users");

    try{

        // search by specified field
        const snapshot = await usersCollectionRef.where(field, "array-contains",value).get();

        // search by default field
        const defaultSnapshot = await usersCollectionRef.where(defaultField, "array-contains",value).get();

        // Combine results from both queries
        const mergedSnapshot = snapshot.docs.concat(defaultSnapshot.docs);

        if(mergedSnapshot.empty || mergedSnapshot.length === 0) {
            return res.status(404).json({message: "No matching users found"});
        }

        const users = mergedSnapshot.map((doc) => ({ id: doc.id, ...doc.data() }));
        /*snapshot.forEach((doc) => {
            users.push({id: doc.id, ...doc.data()});
        });*/

        return res.status(200).json(users);
    } catch(error) {
        console.error("Error searching users:", error);
        return res.status(5000).json({error: "Internal server error"});
    }

}