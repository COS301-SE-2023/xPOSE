const { sequelize, User, Event, EventInvitation, EventParticipant, EventJoinRequest } = require('../data-access/sequelize');
const uploadImageToFirebase = require('../data-access/firebase.repository');
const admin = require('firebase-admin');

async function inviteUserToEvent(req, res) {
    try {
        const { uid } = req.query;
        const { code } = req.params;

        // Find the user with the provided uid
        const user = await User.findOne({
            where: {
                uid: uid,
            },
        });

        // If user doesn't exist, throw an error
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

        // Find the event with the provided event code
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

        // Check if the user is already invited to the event
        const existingInvitation = await EventInvitation.findOne({
            where: {
                user_id_fk: user.id,
                event_id_fk: event.id,
                response: 'pending'
            },
        });

        if (existingInvitation) {
            res.status(400).json({ error: 'User is already invited to the event' });
            return;
        }

        // Create a new invitation
        const invitation = await EventInvitation.create({
            user_id_fk: user.id,
            event_id_fk: event.id,
            response: 'pending',
            timestamp: new Date(),
        });

        res.json(invitation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to invite the user to the event' });
    }
}

module.exports = inviteUserToEvent;
