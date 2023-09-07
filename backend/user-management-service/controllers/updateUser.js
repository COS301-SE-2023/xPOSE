import admin from "firebase-admin";
import generateRandomAlphanumeric from './generateRandomAlphanumeric.js';

export const updateUser = async (req, res) => {
    
    try {
        const { userId } = req.params;
        const { displayName, photoURL, visibility } = req.body;

         // Retrieve the user document from the Users collection
        const userRef = admin.firestore().collection('Users').doc(userId);
        const userDoc = await userRef.get();

        // if there's no such user
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

         // Update the user document fields based on the provided values
        const updatedFields = {};
        if (displayName || displayName != "") updatedFields.displayName = displayName;
        if (photoURL || photoURL !="") updatedFields.photoURL = photoURL;
        if (visibility) updatedFields.visibility = visibility;

        /*const alph = generateRandomAlphanumeric(6);
        let uniq_username_ = `${displayName}${alph}`;
        updatedFields.uniq_username = uniq_username_;*/
        
        // Update the user document with the new values
        await userRef.update(updatedFields);

        res.status(200).json({message:`User with the id ${userId} has been updated`});

    } catch(error) {
        console.error('Error updating user: ', error);
        res.status(500).json({ error: 'An Error ocurred while updating the user' });
    }
}





