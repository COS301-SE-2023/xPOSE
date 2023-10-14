const db = require('../data-access/firebase');

async function deleteMessage(req, res) {
    try {
        const { uid } = req.query;
        const { event_id, chat_id } = req.params;

        // Retrieve the message to be deleted
        const messageRef = db.collection('Event-Chats').doc(event_id).collection('chats').doc(chat_id);
        const messageDoc = await messageRef.get();

        // Check if the message exists
        if (!messageDoc.exists) {
            return res.status(404).json({ error: 'Message not found' });
        }

        const messageData = messageDoc.data();

        // Check if the uid in the query parameters matches the uid in the message data
        if (uid !== messageData.uid) {
            return res.status(403).json({ error: 'Unauthorized: You cannot delete this message' });
        }

        // Delete the document in the Event-Chats collection's subcollection "chats"
        await messageRef.delete();

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = deleteMessage;
