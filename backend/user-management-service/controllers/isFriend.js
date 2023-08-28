import { v4 as uuidv4 } from 'uuid';
import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { Op } from 'sequelize';

let users = [];

export const isFriend = async (req, res) => {
    try {
        const { userId, requestId } = req.params;
        const friendship = await Friendship.findOne({
            where: {
                [Op.or]: [
                    {
                        USERID1: userId,
                        USERID2: requestId,
                    },
                    {
                        USERID1: requestId,
                        USERID2: userId,
                    },
                ],
            },
        });
        
        if (friendship) {
            return res.status(200).json({ areFriends: true });
        } else {
            return res.status(200).json({ areFriends: false });
        }
      } catch (error) {
        console.error('Error getting friends:', error);
        res.status(500).json({ error: 'An error occurred while getting friends' });
      }
}

