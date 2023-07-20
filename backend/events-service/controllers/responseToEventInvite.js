const { sequelize, User, Event, EventInvitation, EventParticipant, EventJoinRequest } = require('../data-access/sequelize');
const uploadImageToFirebase = require('../data-access/firebase.repository');
const admin = require('firebase-admin');

async function responseToEventInvite(req, res) {
    try {
        const { code } = req.params; // Change req.code to req.body.code
        const { uid } = req.query;
        const { response } = req.body; // Remove invitation_id from req.body

        // Check if required fields are present in the request body
        if (!uid || !code || !response) {
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

        // Find the invitation with pending status for the given event code and user id
        const invitation = await EventInvitation.findOne({
            where: {
                event_id_fk: event.id,
                user_id_fk: user.id,
                response: 'pending',
            },
        });

        // If invitation doesn't exist, throw an error
        if (!invitation) {
            res.status(404).json({ error: 'Invitation not found' });
            return;
        }

        // Update the invitation with the response
        await invitation.update({
            response: response,
        });

        // If the response is "accepted", add the user to the event participants
        if (response === 'accepted') {
            await EventParticipant.create({
                user_id_fk: user.id,
                event_id_fk: invitation.event_id_fk,
                timestamp: new Date(),
            });
        }

        res.json({ message: 'Invitation response processed successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process the invitation response' });
    }
}


module.exports = responseToEventInvite;
