import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { Op, Sequelize } from "sequelize";

export const removeFriend = async (req, res) => {
    try {

       
        const {userId, requestId } = req.params;
        console.log ("Testing remove:::",userId);
        console.log ("Testing remove:::",requestId);

          await Friendship.destroy({
            where: {
              [Sequelize.Op.or]: [
                {userID1: userId, userID2: requestId},
                {userID1: requestId, userID2: userId},
              ]
            }
          });

        res.status(200).json({ message: `Friend with id ${requestId} removed`});
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ error: 'An error occurred while removing friend' });
    }
}




