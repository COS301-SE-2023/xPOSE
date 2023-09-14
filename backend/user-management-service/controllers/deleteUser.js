import { v4 as uuidv4 } from 'uuid';
import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { Op } from 'sequelize';

let users = [];
export const deleteUser = async (req, res) => {
    try {
        const {userId} = req.params;

        // Delete the user account from Firebase Authentication
        await admin.auth().deleteUser(userId);

        //delete the user document from the Users collection
        await admin.firestore().collection('Users').doc(userId).delete();

        // destroy user from sql table
        await User.destroy({
            where: {
                firebase_doc_ref: userId
            }
        });

        // destroy friendship if it exists
        await Friendship.destroy({
            where: {
                [Op.or]: [
                    {userID1:userId},
                    {userID2:userId}
                ]
            }

        });
        res.status(200).json({message:`User with the id ${userId} deleted from DB successfuly`});

    } catch(error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
}







  






