const express = require('express');
const router = express.Router();
const { createChat, getChats, deleteChat } = require('./routes/index');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(upload.none());

// Create a chat
router.post('/chats/:event_id', createChat);

// Get all chats
router.get('/chats/:event_id', getChats);

// Delete a chat
router.delete('/chats/:event_id', deleteChat);

module.exports = router;