const express = require('express');
const router = express.Router();
const { createChat, getChats, deleteChat, addRestrictedWord, deleteRestrictedWords, deleteMessage } = require('./routes/index');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(upload.none());

// Create a chat
router.post('/chats/:event_id', createChat);

// add restricted word
router.post('/chats/:event_id/restrictedWord', addRestrictedWord);

// delete restricted word
router.post('/chats/:event_id/restrictedWord_deleted', deleteRestrictedWords);

// router delete message
router.post('/chats/:event_id/message_delete/:chat_id', deleteMessage);

// Get all chats
router.get('/chats/:event_id', getChats);

// Delete a chat
router.delete('/chats/:event_id', deleteChat);

module.exports = router;