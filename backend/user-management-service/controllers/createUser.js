import { v4 as uuidv4 } from 'uuid';
import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import Friend_request from '../data-access/models/friend_request.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';
import generateRandomAlphanumeric from './generateRandomAlphanumeric.js';

let users = [];
export const createUser = async (req, res) => {
    try {
        // get user data from the request body
        console.log('req.body:', req.body);

        const { 
          displayName,
          uniq_username,
          email, 
          password, 
          emailVerified,
          privacy, 
          bio,
          photoURL,
          visibility 
        } = req.body;

        const uid = uuidv4();
        // generate unique username
        const alph = generateRandomAlphanumeric(6);
        let uniq_username_ = `${displayName}${alph}`;

        const user = {
            displayName,
            uniq_username:uniq_username_,
            email,
            emailVerified,
            privacy,
            bio,
            photoURL: `https://firebasestorage.googleapis.com/v0/b/xpose-4f48c.appspot.com/o/profiles%2Falexander-shatov-kmYw-PkX5M4-unsplash.jpg?alt=media&token=a60cc25d-2a94-4b51-8f97-6f67399a7568`,
            uid,
            visibility
          };

        //Create the user in Firebase Authentication
        await admin.auth().createUser({
            uid,
            email,
            password,
        });

      // console.log('User', user);

      // add user document to the firestore
      await admin.firestore().collection('Users').doc(uid).set(user);
        
      // add user reference in the sql database
      await User.create({
        firebase_doc_ref: uid
      });

      res.send({message: `User with the name ${displayName} added to the DB`});

    } catch(error){
        console.error('Error creating user: ', error);
        res.status(500).json({ error: 'Error ocurred while creating user' });
    }
}
