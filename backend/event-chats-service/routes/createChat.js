const admin = require('firebase-admin');
const db = require('../data-access/firebase');

async function createChat(req, res) {
    try {
        const { uid } = req.query;
        const { event_id } = req.params;
        const { message } = req.body;

        // const settings = {};
        const timestamp = admin.firestore.FieldValue.serverTimestamp();

        // Create a new document in the Event-Chats collection
        const docRef = db.collection('Event-Chats').doc(event_id);

        // Add a new chat message to the chats subcollection
        const chatDocRef = await docRef.collection('chats').add({ message, uid, timestamp });

        // Retrieve the newly created chat document
        const newChatDoc = await chatDocRef.get();

        // Construct the chat object with its contents
        const chatObject = {
        id: newChatDoc.id,
        message: newChatDoc.data().message,
        uid: newChatDoc.data().uid,
        timestamp: newChatDoc.data().timestamp,
        };

        res.status(201).json(chatObject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = createChat;
