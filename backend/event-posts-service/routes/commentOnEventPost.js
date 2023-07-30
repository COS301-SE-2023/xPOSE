const { uploadImageToFirebase, admin } = require('../data-access/firebase');
const db = admin.firestore();

async function commentOnEventPost(req, res) {
    try {
        const { uid } = req.query;
        const { event_id, post_id } = req.params;
        const { comment } = req.body;

        if (!event_id || !post_id || !uid || !comment) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Create a new comment object with relevant information
        const commentObject = {
            uid,
            comment,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };

        // Get the reference to the post document
        const postRef = db.collection('Event-Posts').doc(event_id).collection('posts').doc(post_id);

        // Add the new comment to the comments subcollection
        await postRef.collection('comments').add(commentObject);

        res.status(201).json(commentObject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = commentOnEventPost;
