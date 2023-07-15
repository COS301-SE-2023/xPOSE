const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const uploadImageToFirebase = require('./data-access/firebase.repository');
const app = express();
const upload = multer({ dest: 'uploads/' });
const PostBuilder  = require('./libs/PostBuilder');
const CommentBuilder  = require('./libs/CommentBuilder');
const LikeBuilder  = require('./libs/LikeBuilder');

// Firestore and Storage references
const db = admin.firestore();
const storage = admin.storage().bucket();

// Create a new post for an event
app.post('/:event_id', upload.single('image'), async (req, res) => {
  try {
    const { event_id } = req.params;

    // Check if the event exists
    const event = await db.collection('Event-Posts').doc(event_id).get();
    if (!event.exists) {
        return res.status(404).json({ error: 'Event not found' });
    }
    // const { settings } = await db.collection('Event-Posts').doc(event_id).get();
    // ! NOTE IS THAT A SETTING COULD BE WHETHER OR NOT AN EVENT CAN BE UPDATED

    const { uid } = req.body;

    const postBuilder = new PostBuilder();
    postBuilder
    .withUid(uid)
    .withTimestamp(admin.firestore.Timestamp.now())
    .withComments()
    .withLikes();

    // Upload the image to Firebase Storage
    const file = req.file;
    const post_id = await uploadImageToFirebase(event_id, postBuilder, file);

    res.status(201).json({ 
        post_id,
        message: 'Post created successfully' });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Add a comment to a post
app.post('/:event_id/:post_id', async (req, res) => {
  try {
    const { event_id, post_id } = req.params;
    const { uid, message, timestamp } = req.body;

    // Store the comment in Firestore
    const comment = { uid, message, timestamp: new Date(timestamp) };
    await db
      .collection('Event-Posts')
      .doc(event_id)
      .collection('posts')
      .doc(post_id)
      .collection('comments')
      .add(comment);

    res.status(201).json({ message: 'Comment added successfully' });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Add a like to a post
app.post('/:event_id/:post_id/like', async (req, res) => {
  try {
    const { event_id, post_id } = req.params;
    const { uid, timestamp } = req.body;

    // Store the like in Firestore
    const like = { uid, timestamp: new Date(timestamp) };
    await db
      .collection('Event-Posts')
      .doc(event_id)
      .collection('posts')
      .doc(post_id)
      .collection('likes')
      .add(like);

    res.status(201).json({ message: 'Like added successfully' });
  } catch (err) {
    console.error('Error adding like:', err);
    res.status(500).json({ error: 'Failed to add like' });
  }
});

// Remove a like from a post
app.delete('/:event_id/:post_id/like', async (req, res) => {
    res.status(500).json({ error: 'Not available' });
});

// Add comment to post
app.post('/:event_id/:post_id/comments', async (req, res) => {
    res.status(500).json({ error: 'Not available' });
});

// Get comments
app.get('/:event_id/:post_id/comments', async (req, res) => {
    res.status(500).json({ error: 'Not available' });
});

// delete a post
app.delete('/:event_id/:post_id', async (req, res) => {
    try {
        const { event_id, post_id } = req.params;

        // Delete the post from Firestore
        await db
        .collection('Event-Posts')
        .doc(event_id)
        .collection('posts')
        .doc(post_id)
        .delete();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// GET POSTS FOR EVENT
app.get('/:event_id', async (req, res) => {
    // Get all the posts, along with the number of likes for each post
    res.status(500).json({ error: 'Not available' });
});

const PORT = 8005;

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
