const { sequelize, User, Event, EventInvitation, EventParticipant, EventJoinRequest } = require('../data-access/sequelize');
const uploadImageToFirebase = require('../data-access/firebase.repository');
const admin = require('firebase-admin');

async function responseToEventJoinRequest(req, res) {
    try {
        const { uid } = req.query;
        const { response } = req.body; // Remove request_id from req.body
        const { code } = req.params;

        // Check if required fields are present in the request body
        if (!uid || !response) {
            res.status(400).json({ error: 'Invalid request. Required fields are missing.' });
            return;
        }

        // Check if the response is valid
        if (response !== 'accepted' && response !== 'rejected') {
            res.status(400).json({ error: 'Invalid response. Response must be either "accepted" or "rejected".' });
            return;
        }

        // Find the user
        const user = await User.findOne({
            where: {
                uid: uid,
            },
        });

        // If user doesn't exist, throw an error
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Find the event
        const event = await Event.findOne({
            where: {
                code: code,
            },
        });

        // If event doesn't exist, throw an error
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }

        // Check if the user is the event owner or already a participant
        const isOwner = user.id === event.owner_id_fk;
        const isParticipant = await EventParticipant.findOne({
            where: {
                user_id_fk: user.id,
                event_id_fk: event.id,
            },
        });

        if (isOwner || isParticipant) {
            res.status(400).json({ error: 'User cannot request to join their own event or if already a participant' });
            return;
        }

        // Check if the request is already sent and its response is pending
        const existingRequest = await EventJoinRequest.findOne({
            where: {
                user_id_fk: user.id,
                event_id_fk: event.id,
                response: 'pending',
            },
        });

        if (!existingRequest) {
            res.status(404).json({ error: 'Request does not exist or already processed' });
            return;
        }

        // Update the request with the response
        const joinRequest = await existingRequest.update({
            response: response,
        });

        // If the response is "accepted", add the user to the event participants
        if (response === 'accepted') {
            await EventParticipant.create({
                user_id_fk: user.id,
                event_id_fk: event.id,
                timestamp: new Date(),
            });
        }

        res.json(joinRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process the request to join the event' });
    }
}

module.exports = responseToEventJoinRequest;
