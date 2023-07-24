import admin from "firebase-admin";

export const updateUser = async (req, res) => {

    try {
        const { userId } = req.params;
        const { displayName, photoURL } = req.body;

         // Retrieve the user document from the Users collection
        const userRef = admin.firestore().collection('Users').doc(userId);
        const userDoc = await userRef.get();

        // if there's no such user
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

         // Update the user document fields based on the provided values
        const updatedFields = {};
        if (displayName) updatedFields.displayName = displayName;
        if (photoURL) updatedFields.photoURL = photoURL;
        
        // Update the user document with the new values
        await userRef.update(updatedFields);

        res.status(200).send(`User with the id ${userId} has been updated`);

    } catch(error) {
        console.error('Error updating user: ', error);
        res.status(500).json({ error: 'An Error ocurred while updating the user' });
    }
}





