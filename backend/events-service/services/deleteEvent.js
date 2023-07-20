const { sequelize, User, Event, EventInvitation, EventParticipant, EventJoinRequest } = require('../data-access/sequelize');
const uploadImageToFirebase = require('../data-access/firebase.repository');
const admin = require('firebase-admin');

async function deleteEvent(req, res) {
    try {
        console.log('Deleting event:');
        console.log(req.body);
        // If there's no uid, throw an error
        if (!req.body.uid) {
            res.status(400).json({ error: 'No uid provided' });
            return;
        }

        const user = await User.findOne({
            where: {
                uid: req.body.uid,
            },
        });

        // If user doesn't exist, throw an error
        if (!user) {
            res.status(404).json({ error: 'User does not exist' });
            return;
        }

        const event = await Event.findOne({
            where: {
                code: req.params.code,
            },
        });

        if (event) {
            // Verify if the user owns this event
            if (user.id !== event.owner_id_fk) {
                res.status(400).json({ error: 'User does not own this event' });
                return;
            }

            await event.destroy();
            res.sendStatus(204);
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete the event' });
    }
}

module.exports = deleteEvent;
