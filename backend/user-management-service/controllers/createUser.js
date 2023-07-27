import { v4 as uuidv4 } from 'uuid';
import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import Friend_request from '../data-access/models/friend_request.table.js';
import Friendship from '../data-access/models/friendship.table.js';
import { sendMessageToQueue } from '../sender.js';


let users = [];
export const createUser = async (req, res) => {
    try {
        // get user data from the request body
        console.log('req.body:', req.body);

        const { 
          displayName,
          email, 
          password, 
          emailVerified,
          privacy, 
          bio,
          photoObject,
          visibility 
        } = req.body;

        const uid = uuidv4();

        const user = {
            displayName,
            email,
            emailVerified,
            privacy,
            bio,
            photoObject,
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
