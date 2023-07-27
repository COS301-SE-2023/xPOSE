const admin = require('firebase-admin');
const db = admin.firestore();

async function likeEventPost(req, res) {
    try {
        const { event_id, post_id } = req.params;
        const { uid } = req.body;

        if (!event_id || !post_id || !uid) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Get the reference to the post document
        const postRef = db.collection('Event-Posts').doc(event_id).collection('posts').doc(post_id);

        // Check if the post already has a 'likes' subcollection
        const likesCollection = postRef.collection('likes');
        const likeSnapshot = await likesCollection.where('uid', '==', uid).get();

        // If the user has already liked the post, return an error
        if (!likeSnapshot.empty) {
            return res.status(400).json({ error: 'User has already liked this post' });
        }

        // Create a new like object with relevant information
        const likeObject = {
            uid,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };

        // Add the new like to the 'likes' subcollection
        await likesCollection.add(likeObject);

        res.status(201).json(likeObject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = likeEventPost;
