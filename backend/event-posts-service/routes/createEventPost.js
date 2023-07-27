// const  = require('firebase-admin');
const { uploadImageToFirebase, admin } = require('../data-access/firebase');
const db = admin.firestore();

async function createEventPost(req, res) {
    try {
        const { uid } = req.query;
        const { event_id } = req.params;
        const image = req.file;
        console.log('createEventPost', uid, event_id, image);
        console.log('createEventPost', req.query, req.params, req.body, req.file);
        if(!uid || !event_id || !image) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // console.log(image);
        // post image to firebase storage
        const image_url = await uploadImageToFirebase(uid, image);

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
