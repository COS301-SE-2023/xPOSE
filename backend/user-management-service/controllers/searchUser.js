import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';


export const searchUser = async (req, res) => {
    const { field, value } = req.query;
    const defaultField = 'displayName'; // Default field to search by

    if (!field || !value) {
        return res.status(400).json({ error: "Invalid parameters" });
    }

    const db = admin.firestore();
    const usersCollectionRef = db.collection("Users");

    try {
        const querySnapshot = await usersCollectionRef.get();

        const matchingUsers = [];
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData[field] && userData[field].includes(value)) {
                matchingUsers.push({ id: doc.id, ...userData });
            } else if (userData[defaultField] && userData[defaultField].includes(value)) {
                matchingUsers.push({ id: doc.id, ...userData });
            }
        });

        if (matchingUsers.length === 0) {
            return res.status(404).json({ message: "No matching users found" });
        }

        return res.status(200).json(matchingUsers);
    } catch (error) {
        console.error("Error searching users:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
