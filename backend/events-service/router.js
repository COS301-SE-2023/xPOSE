const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const {
    createEvent,
    deleteEvent,
    getEvent,
    getEvents,
    inviteUserToEvent,
    removeUserFromEvent,
    responseToEventInvite,
    responseToEventJoinRequest,
    updateEvent,
    userRequestToJoinEvent,
} = require('./controllers/index');

// test route
router.get('/', upload.none(),async (req, res) => {
    res.send('Hello from the events service!');
});

// Create an event
router.post('/events', upload.single('image'), createEvent);

// Get all events
router.get('/events', upload.none(), getEvents);

// Get a single event by code
router.get('/events/:code', upload.none(), getEvent);

// Update an event
router.put('/events/:code', upload.single('image'), updateEvent);

// Delete an event
router.delete('/events/:code', upload.none(), deleteEvent);

// Invite user
router.post('/events/:code/invite/', upload.none(), inviteUserToEvent);

// response from invited user
router.put('/events/:code/invite', upload.none(), responseToEventInvite);
  
// user requesting to join
router.post('/events/:code/request', upload.none(), userRequestToJoinEvent);

// response to the user request to join
router.put('/events/:code/request', upload.none(), responseToEventJoinRequest);

// remove user
router.delete('/events/:code/remove', upload.none(), removeUserFromEvent);

// export router
module.exports = router;
