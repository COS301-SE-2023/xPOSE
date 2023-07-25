const db = require('../data-access/firebase');

async function getChats(req, res) {
  try {
    const { uid, after } = req.query;
    const { event_id } = req.params;

    let query = db.collection('Event-Chats').doc(event_id).collection('chats').orderBy('timestamp', 'desc');

    // If "after" parameter is provided, filter messages posted after the given timestamp
    if (after) {
      const afterTimestamp = new Date(after);
      query = query.where('timestamp', '>', afterTimestamp);
    }

    const snapshot = await query.get();
    const chats = [];

    // Iterate through each chat document
    for (const doc of snapshot.docs) {
      const chat = doc.data();
      chat.id = doc.id;

      // Retrieve the displayName using the uid from the chat document
      if (chat.uid) {
        const userSnapshot = await db.collection('Users').doc(chat.uid).get();
        if (userSnapshot.exists) {
          const user = userSnapshot.data();
          chat.displayName = user.displayName;
        }
      }

      chats.push(chat);
    }

    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

module.exports = getChats;
