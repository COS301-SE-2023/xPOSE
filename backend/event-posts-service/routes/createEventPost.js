const admin = require('firebase-admin');
const db = require('../data-access/firebase');

async function createEventPost(req, res) {
    try {
        const { uid } = req.query;
        const { event_id } = req.params;
        const image = req.file;

        // post image to firebase storage
        const image_url = await db.uploadImage(image);

        // const settings = {};
        const timestamp = admin.firestore.FieldValue.serverTimestamp();

        // Create a new document in the Event-Chats collection
        const docRef = db.collection('Event-Posts').doc(event_id);

        // Add a new chat message to the chats subcollection
        const postDocRef = await docRef.collection('posts').add({ image_url, uid, timestamp });

        // Retrieve the newly created chat document
        const newPostDoc = await postDocRef.get();

        // Construct the chat object with its contents
        const postObject = {
            id: newPostDoc.id,
            image_url: newPostDoc.data().image_url,
            uid: newPostDoc.data().uid,
            timestamp: newPostDoc.data().timestamp,
        };

        res.status(201).json(postObject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = createEventPost;
