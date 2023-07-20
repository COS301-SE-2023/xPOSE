const db = require('../data-access/firebase');

async function deleteChat(req, res) {
    try {
        const { uid, chat_id } = req.query;
        const { event_id } = req.params;

        // Delete the document in the Event-Chats collection
        await db.collection('Event-Chats').doc(event_id).collection('chats').doc(chat_id).delete(); 

        res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = deleteChat;
