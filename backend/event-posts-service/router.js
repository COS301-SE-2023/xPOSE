const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const express = require('express');
const router = express.Router();

// 

// Create a new post
router.post('/:event_id', upload.single('image'), async (req, res) => {});

// Add a comment to a post
router.post('/:event_id/:post_id', async (req, res) => {});

// Add a like to a post
router.post('/:event_id/:post_id/like', async (req, res) => {});

// Delete a post
router.delete('/:event_id/:post_id', async (req, res) => {});

module.exports = router;
