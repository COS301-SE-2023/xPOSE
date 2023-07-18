const db = require('../data-access/firebase');

async function getChats(req, res) {
    try {
        const { uid } = req.query;
        const { event_id } = req.params;

        const snapshot = await db.collection('Event-Chats').doc(event_id).collection('chats').orderBy('timestamp', 'desc').get();
        const chats = [];

        snapshot.forEach((doc) => {
            const chat = doc.data();
            chat.id = doc.id;
            chats.push(chat);
        });

        res.json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = getChats;