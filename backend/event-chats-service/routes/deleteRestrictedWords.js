const db = require('../data-access/firebase');

async function deleteRestrictedWords(req, res) {
    try {
        const { event_id } = req.params;
        const tagWordsToDelete = req.body.restrictedWords;

        // console.log("Testing::::::::::?/////////////");
        // Ensure tagWordsToDelete is always an array
        const tagWordsArray = Array.isArray(tagWordsToDelete) ? tagWordsToDelete : [tagWordsToDelete];

        // Remove duplicates and empty values
        const nonEmptyTagWordsToDelete = [...new Set(tagWordsArray.filter(tagWord => tagWord.trim() !== ''))];

        // Reference to the Firestore collection
        const eventChatsCollection = db.collection('Event-Chats');

        // Check if the specified event_id exists in the collection
        eventChatsCollection
            .doc(event_id)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const existingTagWords = doc.data().tagWords || [];

                    // Remove words from existingTagWords that are in nonEmptyTagWordsToDelete
                    const updatedTagWords = existingTagWords.filter(word => !nonEmptyTagWordsToDelete.includes(word));

                    eventChatsCollection.doc(event_id).update({
                        tagWords: updatedTagWords
                    }).then(() => {
                        res.status(200).json({ message: 'Tag words deleted successfully', tagWords: updatedTagWords });
                    });
                } else {
                    res.status(404).json({ message: 'Event not found' });
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ error: 'Something went wrong' });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = deleteRestrictedWords;
