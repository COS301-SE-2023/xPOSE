const db = require('../data-access/firebase');

async function deleteMessage(req, res) {
    try {
        const {event_id, chat_id } = req.params;
        // Delete the document in the Event-Chats collection's subcollection "chats"

        console.log("event_id::::", event_id);
        console.log("chat_id:::", chat_id);

        await db.collection('Event-Chats').doc(event_id).collection('chats').doc(chat_id).delete(); 

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = deleteMessage;
