const { sequelize, User, Event, EventInvitation, EventParticipant, EventJoinRequest } = require('../data-access/sequelize');
const uploadImageToFirebase = require('../data-access/firebase.repository');
const admin = require('firebase-admin');

async function responseToEventInvite(req, res) {
    try {
        const { code } = req.params; // Change req.code to req.body.code
        const { uid, invitee } = req.query;
        const { response } = req.body; // Remove invitation_id from req.body

        // Check if required fields are present in the request body
        if (!uid || !invitee || !code || !response) {
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

        // Find the invitee
        const inviteeUser = await User.findOne({
            where: {
                uid: invitee,
            },
        });

        // If user doesn't exist, throw an error
        if (!user || !inviteeUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Find the event
        const event = await Event.findOne({
            where: {
                code: code,
            },
        });

        // Check if event exists
        if(!event) {
            res.status(404).json({ error: 'Event not found' });
        }

        // Find the invitation with pending status for the given event code and user id
        const invitation = await EventInvitation.findOne({
            where: {
                event_id_fk: event.id,
                user_id_fk: inviteeUser.id,
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
                user_id_fk: inviteeUser.id,
                event_id_fk: invitation.event_id_fk,
                timestamp: new Date(),
            });
        }

        // Delete the invitation
        await invitation.destroy();

        // Send back notification to the user who sent the invitation


        res.json({ message: 'Invitation response processed successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process the invitation response' });
    }
}


module.exports = responseToEventInvite;
