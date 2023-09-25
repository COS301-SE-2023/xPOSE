import { v4 as uuidv4 } from 'uuid';
import admin from "firebase-admin";
import User from '../data-access/models/user.table.js';
import {generateUsername} from 'username-generator';

// This function saves the user's longitude and latitude in the database
export const saveUserLocation = async (req, res) => {
    try {
        // get user data from the request body
        const { longitude, latitude } = req.body;
        const { userId } = req.params;

        // save user to firestore document of the user
        const userRef = admin.firestore().collection("Users").doc(userId);
        
        // check if the longitude and latitude are numbers
        // if (Nu) {

        // }
        
        // Convert longitude and latitude to numbers
        const longit = Number(longitude);
        const latitud = Number(latitude);

        if (isNaN(longit) || isNaN(latitud)) {
            res.status(400).json({ error: 'Longitude and latitude must be numbers' });
            return;
        }

        // create a new GeoPoint object with the longitude and latitude
        const geoPoint = new admin.firestore.GeoPoint(latitud, longit);

        // add the GeoPoint to the user document
        await userRef.set({
        location: geoPoint
        }, { merge: true });

        res.send({message: `User's location saved added to firestore`});
    } catch(error){
        console.error('Error creating user: ', error);
        res.status(500).json({ error: 'Error ocurred while creating user' });
    }
}
