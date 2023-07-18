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

        res.status(201).json({ id: chatDocRef.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = createChat;
