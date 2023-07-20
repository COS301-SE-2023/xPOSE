const { sequelize, User, Event, EventInvitation, EventParticipant, EventJoinRequest } = require('../data-access/sequelize');
const uploadImageToFirebase = require('../data-access/firebase.repository');
const admin = require('firebase-admin');

async function joinEvent(req, res) {
    const { uid } = req.query;
    const { code } = req.params;

    try {
        // Find the user with the provided uid
        const user = await User.findOne({
            where: {
                uid: uid,
            },
        });

        // If user doesn't exist, create a new user
        if (!user) {
            const firestoreUserDoc = await admin.firestore().collection('Users').doc(uid).get();

            if (firestoreUserDoc.exists) {
                // Create the user in the Users table
                user = await User.create({ uid: uid });
            } else {
                res.status(400).json({ error: 'Invalid user' });
                return;
            }
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

        // Check if the user is already a participant of the event
        const isParticipant = await EventParticipant.findOne({
            where: {
                user_id_fk: user.id,
                event_id_fk: event.id,
            },
        });

        if (isParticipant) {
            res.status(400).json({ error: 'User is already a participant of the event' });
            return;
        }

        // Check if the event is private
        if (event.privacy_setting === 'private') {
            res.status(400).json({ error: 'Event is private' });
            return;
        }

        // add the user to the event participants
        await EventParticipant.create({
            user_id_fk: user.id,
            event_id_fk: event.id,
            timestamp: new Date(),
        });

        res.json({ message: 'User joined the event' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to join the event' });
    }
}

module.exports = joinEvent;