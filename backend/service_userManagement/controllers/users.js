import { v4 as uuidv4 } from 'uuid';
import admin from "firebase-admin";


let users = [];

export const getUsers = async (req, res) => {
    try {
        const db = admin.firestore();
        const userRef = db.collection("Users");
        const querySnapshot = await userRef.get();

        querySnapshot.forEach((user) =>{
            users.push(user.data());
        });

        res.json(users);

    } catch(error){
        console.error('Error retrieving users: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getUser = (req, res) => {
    const { userId } = req.params;
    const userRef = admin.firestore().collection('Users').doc(userId);
    
    try{
        userRef.get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                res.status(200).json(userData);
            }else {
                res.status(404).json({error: "User not found"});
            }
        })
        .catch((error) => {
            console.error('Error retrieving user: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });

    } catch(error){
        console.error('Error retrieving user: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const createUser = async (req, res) => {
    try {
        // get user data from the request body
        const { displayName, email, password, emailVerified, friendIds, photoURL } = req.body;

        const uid = uuidv4();

        const user = {
            displayName,
            email,
            emailVerified,
            friendIds,
            photoURL,
            uid,
          };

          // Create the user in Firebase Authentication
        await admin.auth().createUser({
            uid,
            email,
            password,
        });

        // add user document to the firestore
        await admin.firestore().collection('Users').doc(uid).set(user);
        res.send(`User with the name ${displayName} added to the DB`);

    } catch(error){
        console.error('Error creating user: ', error);
        res.status(500).json({ error: 'Error ocurred while creating user' });
    }
}

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

export const deleteUser = async (req, res) => {
    try {
        const {userId} = req.params;

        // Delete the user account from Firebase Authentication
        await admin.auth().deleteUser(userId);

        //delete the user document from the Users collection
        await admin.firestore().collection('Users').doc(userId).delete();
       
        res.status(200).send(`User with the id ${userId} deleted from DB successfuly`);

    } catch(error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
}

export const getFriends = async (req, res) => {
    try {
        const { userId } = req.params;
    
        // Get the user document
        const userDoc = await admin.firestore().collection('Users').doc(userId).get();
    
        // Check if the user exists
        if (!userDoc.exists) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Retrieve the friendIds array from the user document
        const { friendIds } = userDoc.data();
    
        // Check if the friendIds array is empty
        if (!friendIds || friendIds.length === 0) {
          return res.status(200).json({ friends: [] });
        }
    
        // Get the friend documents based on the friendIds
        const friendDocs = await admin
          .firestore()
          .collection('Users')
          .where(admin.firestore.FieldPath.documentId(), 'in', friendIds)
          .get();
    
        // Extract the friend data from the friend documents
        const friends = friendDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
    
        res.status(200).json({ friends });
      } catch (error) {
        console.error('Error getting friends:', error);
        res.status(500).json({ error: 'An error occurred while getting friends' });
      }
}

export const getFriend = async (req, res) => {
    try {
        const { userId, requestId } = req.params;
    
        // Get the user document
        const userDoc = await admin.firestore().collection('Users').doc(userId).get();
    
        // Check if the user exists
        if (!userDoc.exists) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Retrieve the friendIds array from the user document
        const { friendIds } = userDoc.data();
    
        // Check if the friendIds array is empty
        if (!friendIds || friendIds.length === 0) {
          return res.status(404).json({ error: 'No friends found' });
        }
    
        // Check if the specified friend ID exists in the friendIds array
        if (!friendIds.includes(requestId)) {
          return res.status(404).json({ error: `Friend with ID ${requestId} not found` });
        }

        // Get the friend document based on the friend ID
        const friendDoc = await admin.firestore().collection('Users').doc(requestId).get();

         // Check if the friend document exists
        if (!friendDoc.exists) {
            return res.status(404).json({ error: 'Friend document not found' });
        }
  
        const friendData = friendDoc.data();
        res.status(200).json({ friend: friendData });

      } catch (error) {
        console.error('Error getting friend:', error);
        res.status(500).json({ error: 'An error occurred while getting friend' });
      }
}

export const sendFriendRequest = async (req, res) => {

    try{
        const {userId, requestId} = req.params;

        // Get the sender and recipient user documents
        const senderDoc = await admin.firestore().collection('Users').doc(userId).get();
        const recipientDoc = await admin.firestore().collection('Users').doc(requestId).get();

        // Check if sender and recipient exist
        if (!senderDoc.exists || !recipientDoc.exists) {
            return res.status(404).json({ error: 'Sender or recipient not found' });
        }

        // Create  friend request object
        const friendRequest = {
            senderId: userId,
            recipientId: requestId,
            status: 'pending',
        };

        // Add the friend request to the recipient's FriendRequests collection
        await admin.firestore().collection('Users').doc(requestId).collection('FriendRequests').doc(userId).set(friendRequest);
        res.status(200).json({ message: `Friend request sent successfully to user with id ${requestId}` });
    } catch(error){
        console.error('Error sending friend request:', error);
        res.status(500).json({ error: 'An error occurred while sending friend request' });  
    }
}

export const removeFriend = async (req, res) =>{
    try {
        const { userId, requestId } = req.params;

        // Remove the friendIds from both users
        await admin.firestore().collection('Users').doc(userId).update({
            friendIds: admin.firestore.FieldValue.arrayRemove(requestId)
        });

        await admin.firestore().collection('Users').doc(requestId).update({
            friendIds: admin.firestore.FieldValue.arrayRemove(userId)
        });

        // Remove the friend requests subcollections
        await admin.firestore().collection('Users').doc(userId).collection('FriendRequests').doc(requestId).delete();
        await admin.firestore().collection('Users').doc(requestId).collection('FriendRequests').doc(userId).delete();

        res.status(200).json({ message: `Friend with id ${requestId} removed`});
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ error: 'An error occurred while removing friend' });
    }



    // const {requestId} = req.params;
    // res.status(200).json({ message: `Friend with id ${requestId} removed`});
}

export const acceptFriendRequest = async (req, res) =>{
    try{
        const {userId, requestId} = req.params;
        
        // Get the recipient user document
        const recipientDoc = await admin.firestore().collection('Users').doc(requestId).get();

        // Check if the recipient exists
        if (!recipientDoc.exists) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

         // Check if the friend request exists and retrieve the request document
        const requestSnapshot = await admin
        .firestore()
        .collection('Users')
        .doc(requestId)
        .collection('FriendRequests')
        .doc(userId)
        .get();

        // Check if the friend request document exists
        if (!requestSnapshot.exists) {
            return res.status(404).json({ error: 'Friend request not found' });
        }

        // Update the status of the friend request to 'accepted'
        await admin
            .firestore()
            .collection('Users')
            .doc(requestId)
            .collection('FriendRequests')
            .doc(userId)
            .update({
            status: 'accepted',
        });

        // Both recipient and sender are now friends Add friend to list of friends

        // Add the new friendID to the recipient's friendIds array
        await admin
            .firestore()
            .collection('Users')
            .doc(requestId)
            .update({
            friendIds: admin.firestore.FieldValue.arrayUnion(userId),
        });

         // Add  new friendID to the sender's friendIds array
        await admin
            .firestore()
            .collection('Users')
            .doc(userId)
            .update({
            friendIds: admin.firestore.FieldValue.arrayUnion(requestId),
        });


        res.status(200).json({ message:`Friend with ${requestId} accepted friend request`});
    } catch(errror){
        console.error('Error accepting friend request:', error);
        res.status(500).json({ error: 'An error occurred while acepting friend request' });  
    }
}

export const rejectFriendRequest = async (req, res) => {
    try {
        const { userId, requestId } = req.params;
        // Check if the user document exists
        const userDoc = await admin.firestore().collection('Users').doc(userId).get();
        if (!userDoc.exists) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Check if the friend request document exists
        const friendRequestDoc = await admin
          .firestore()
          .collection('Users')
          .doc(requestId)
          .collection('FriendRequests')
          .doc(userId)
          .get();
    
        if (!friendRequestDoc.exists) {
          return res.status(404).json({ error: 'Friend request not found' });
        }
    
        // Delete the friend request document
        await admin
          .firestore()
          .collection('Users')
          .doc(requestId)
          .collection('FriendRequests')
          .doc(userId)
          .delete();

        // Remove requestId from the friendIds array in the sender's document
            await admin.firestore().collection('Users').doc(userId).update({
                friendIds: admin.firestore.FieldValue.arrayRemove(requestId)
        });

        // Remove userId from the friendIds array in the recipient's document
           await admin.firestore().collection('Users').doc(requestId).update({
            friendIds: admin.firestore.FieldValue.arrayRemove(userId)
        });

        res.status(200).json({ message: `Friend request from user with ID ${userId} rejected` });
     
    } catch (error) {
        console.error('Error rejecting friend request:', error);
        res.status(500).json({ error: 'An error occurred while rejecting friend request' });
      }
}
