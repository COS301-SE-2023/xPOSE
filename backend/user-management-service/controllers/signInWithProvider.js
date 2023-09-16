import { v4 as uuidv4 } from 'uuid';
import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import {generateUsername} from 'username-generator';

export const signInWithProvider = async (req, res) => {
    try {

        // get user data from the request body
        // console.log('req.body:', req.body);
        // const { uid, displayName } = req.body;

        const uniq_username = generateUsername();
         // Create a Firestore reference to the "Users" collection and set the user data
        const userRef = admin.firestore().collection("Users").doc(req.body.uid);
        
        // get existing user data if it  exists
        const existingUserData = (await userRef.get()).data();

        const mergedUserData = {
          ...req.body,
          uniq_username: existingUserData?.uniq_username || uniq_username
        };
        
        await userRef.set(mergedUserData, { merge: true });

      // add user reference in the sql database if it does not exist
        // Check if the user with the given req.body.uid already exists in SQL
        const existingUser = await User.findOne({ where: { firebase_doc_ref: req.body.uid } });
        if(!existingUser){
          await User.create({
            firebase_doc_ref: req.body.uid,
            userName: req.body.displayName
          });
        }


      res.send({message: `User with the name ${req.body.displayName} added to SQL DB`});

    } catch(error){
        console.error('Error creating user: ', error);
        res.status(500).json({ error: 'Error ocurred while creating user' });
    }
}
