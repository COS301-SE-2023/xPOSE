const { sequelize, User, Event, EventInvitation, EventParticipant, EventJoinRequest } = require('../data-access/sequelize');
const uploadImageToFirebase = require('../data-access/firebase.repository');
const admin = require('firebase-admin');

async function removeUserFromEvent(req, res) {
    try {
        const { uid, participant } = req.query;
        const { code } = req.params;

        // Find the user with the provided uid
        const user = await User.findOne({
            where: {
                uid: uid,
            },
        });

        // Find participant with the provided uid
        const participantUser = await User.findOne({
            where: {
                uid: participant,
            },
        });

        // If user doesn't exist, throw an error
        if (!user || !participantUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Find the event with the provided code
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

        // Check if the user is the event owner
        if (event.owner_id_fk !== user.id) {
            res.status(400).json({ error: 'No authority' });
            return; 
        }

        // Check if the user is the event owner
        if (event.owner_id_fk === participantUser.id) {
            res.status(400).json({ error: 'Event owner cannot be removed' });
            return; 
        }

        // Check if the user is a participant of the event
        const isParticipant = await EventParticipant.findOne({
            where: {
                user_id_fk: participantUser.id,
                event_id_fk: event.id,
            },
        });

        if (!isParticipant) {
            res.status(400).json({ error: 'User is not a participant of the event' });
            return;
        }

        // Remove the user from the event participants
        // await event.removeParticipant(user);
        await EventParticipant.destroy({
            where: {
                user_id_fk: participantUser.id,
                event_id_fk: event.id,
            },
        });

        res.json({ message: 'User removed from the event' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove the user from the event' });
    }
}

module.exports = removeUserFromEvent;