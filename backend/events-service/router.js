const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
// const cors = require('cors');
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
    joinEvent,
} = require('./services/index');

// const setupSwagger = require('./swagger');
// setupSwagger(router);

// router.use(cors);

// test route
router.get('/', upload.none(),async (req, res) => {
    res.send('Hello from the events service!');
});

// Create an event
/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create an event
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               privacy_setting:
 *                 type: string
 *                 enum: [public, private]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Created event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Failed to create an event
 */
router.post('/events', upload.single('image'), createEvent);

// Get all events
router.get('/events', upload.none(), getEvents);

// Get a single event by code
router.get('/events/:code', upload.none(), getEvent);

// Update an event
router.put('/events/:code', upload.single('image'), updateEvent);

// Delete an event
router.delete('/events/:code', upload.none(), deleteEvent);

// User joins an event
router.post('/events/:code/join', upload.none(), joinEvent);

// Invite user
router.post('/events/:code/invite', upload.none(), inviteUserToEvent);

// response from invited user
router.put('/events/:code/invite', upload.none(), responseToEventInvite);
  
// user requesting to join
router.post('/events/:code/request', upload.none(), userRequestToJoinEvent);

// response to the user request to join
router.put('/events/:code/request', upload.none(), responseToEventJoinRequest);

// remove user
router.delete('/events/:code/remove', upload.none(), removeUserFromEvent);

// get participants of an event
// router.get('/events/:code/participants', upload.none(), getEventParticipants);

// export router
module.exports = router;
