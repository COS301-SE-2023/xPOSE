const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const express = require('express');
const router = express.Router();
const { commentOnEventPost, createEventPost, deleteEventPost, likeEventPost } = require('./routes/index');

// Create a new post
router.post('/:event_id', upload.single('image'), createEventPost);

// Add a comment to a post
router.post('/:event_id/:post_id', upload.none(), commentOnEventPost);

// Add a like to a post
router.post('/:event_id/:post_id/like', upload.none(), likeEventPost);

// Delete a post
router.delete('/:event_id/:post_id', upload.none(), deleteEventPost);

module.exports = router;
