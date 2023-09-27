const db = require('../data-access/firebase');

async function addRestrictedWord(req, res) {
    try {
        const { event_id } = req.params;
        const tagWords = req.body.restrictedWords;

        // Ensure tagWords is always an array
        const tagWordsArray = Array.isArray(tagWords) ? tagWords : [tagWords];

        // Filter out empty values from the tagWordsArray
        const nonEmptyTagWords = tagWordsArray.filter(tagWord => tagWord.trim() !== '');
        
        // Reference to the Firestore collection
        const eventChatsCollection = db.collection('Event-Chats');

        // Check if the specified event_id exists in the collection
        eventChatsCollection
            .doc(event_id)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const existingTagWords = doc.data().tagWords || [];

                        // Update the tag words array for the specified event_id as before
                        const updatedTagWords = [...existingTagWords];

                        // Check for duplicates and add only unique non-empty values
                        nonEmptyTagWords.forEach((tagWord) => {
                            if (!updatedTagWords.includes(tagWord)) {
                                updatedTagWords.push(tagWord);
                            }
                        });

                        eventChatsCollection.doc(event_id).update({
                            tagWords: updatedTagWords
                        }).then(() => {
                            // Fetch the updated tag words array and send it in the response
                            eventChatsCollection.doc(event_id).get().then((doc) => {
                                const updatedTagWords = doc.data().tagWords || [];
                                res.status(200).json({ message: 'Tag words updated successfully', tagWords: updatedTagWords });
                            });
                        });
                } else {
                    if (nonEmptyTagWords.length === 0) {
                        // Return an empty array if the request body only contains empty values and the document doesn't exist
                        res.status(200).json({ message: 'No restricted words added', tagWords: [] });
                    } else {
                        // Create a new document if the event_id doesn't exist
                        eventChatsCollection.doc(event_id).set({
                            tagWords: nonEmptyTagWords
                        }).then(() => {
                            // Fetch the updated tag words array and send it in the response
                            eventChatsCollection.doc(event_id).get().then((doc) => {
                                const updatedTagWords = doc.data().tagWords || [];
                                res.status(200).json({ message: 'Tag words added successfully', tagWords: updatedTagWords });
                            });
                        });
                    }
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

module.exports = addRestrictedWord;
