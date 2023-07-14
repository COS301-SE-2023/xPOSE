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

// POST /events/:event_id/posts - Create a new post for an event
app.post('/events/:event_id/posts', upload.single('image'), async (req, res) => {
  try {
    const { event_id } = req.params;

    // Check if the event exists
    const event = await db.collection('Event-Posts').doc(event_id).get();
    if (!event.exists) {
        return res.status(404).json({ error: 'Event not found' });
    }
    // const { settings } = await db.collection('Event-Posts').doc(event_id).get();
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

// POST /events/:event_id/posts/:postId/comments - Add a comment to a post
app.post('/events/:event_id/posts/:postId/comments', async (req, res) => {
  try {
    const { event_id, postId } = req.params;
    const { uid, message, timestamp } = req.body;

    // Store the comment in Firestore
    const comment = { uid, message, timestamp: new Date(timestamp) };
    await db
      .collection('Event-Posts')
      .doc(event_id)
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .add(comment);

    res.status(201).json({ message: 'Comment added successfully' });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// POST /events/:event_id/posts/:postId/likes - Add a like to a post
app.post('/events/:event_id/posts/:postId/likes', async (req, res) => {
  try {
    const { event_id, postId } = req.params;
    const { uid, timestamp } = req.body;

    // Store the like in Firestore
    const like = { uid, timestamp: new Date(timestamp) };
    await db
      .collection('Event-Posts')
      .doc(event_id)
      .collection('posts')
      .doc(postId)
      .collection('likes')
      .add(like);

    res.status(201).json({ message: 'Like added successfully' });
  } catch (err) {
    console.error('Error adding like:', err);
    res.status(500).json({ error: 'Failed to add like' });
  }
});

// DELETE /events/:event_id/posts/:postId - Delete a post
app.delete('/events/:event_id/posts/:postId', async (req, res) => {
  try {
    const { event_id, postId } = req.params;

    // Delete the post from Firestore
    await db
      .collection('Event-Posts')
      .doc(event_id)
      .collection('posts')
      .doc(postId)
      .delete();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Start the server
app.listen(8005, () => {
  console.log('Server started on port 3000');
});
