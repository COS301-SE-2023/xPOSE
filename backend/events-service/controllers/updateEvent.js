const { sequelize, User, Event, EventInvitation, EventParticipant, EventJoinRequest } = require('../data-access/sequelize');
const uploadImageToFirebase = require('../data-access/firebase.repository');
const admin = require('firebase-admin');

async function updateEvent(req, res) {
    try {
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

        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }

        // Verify if the user owns this event
        if (user.id !== event.owner_id_fk) {
            res.status(400).json({ error: 'User does not own this event' });
            return;
        }

        // Update the event
        const eventData = req.body;

        // Check if the request contains an image, if not, exclude it from the update
        if (!req.file) {
            delete eventData.image_url;
        } else {
            const image_url = await uploadImageToFirebase(req.body.uid, req.file);
            eventData.image_url = image_url;
        }

        await event.update(eventData);
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update the event' });
    }
}

module.exports = updateEvent;
