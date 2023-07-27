const { uploadImageToFirebase, admin } = require('../data-access/firebase');
const db = admin.firestore();

async function deleteEventPost(req, res) {
    try {
        const { event_id, post_id } = req.params;

        if (!event_id || !post_id) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Get the reference to the post document
        const postRef = db.collection('Event-Posts').doc(event_id).collection('posts').doc(post_id);

        // Delete the post document
        await postRef.delete();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = deleteEventPost;
