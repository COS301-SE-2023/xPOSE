const { sequelize, User, Event, EventInvitation, EventParticipant, EventJoinRequest } = require('../data-access/sequelize');
const uploadImageToFirebase = require('../data-access/firebase.repository');
const admin = require('firebase-admin');

async function getEventParticipants(req, res) {
    const { uid } = req.query;
    const { code } = req.params;

    try {
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

        // Find the participants for the event
        const participants = await EventParticipant.findAll({
            where: {
                event_id_fk: event.id,
            },
            include: [{ model: User, as: 'user' }], // Include the User model to get user data
        });

        // if the event has no participants, return an empty array
        if (!participants || participants.length === 0) {
            res.status(200).json([]);
            return;
        }

        // Create an array to store the required data
        const participantsData = participants.map((participant) => ({
            uid: participant.user.uid,
            display_name: '', // We will populate this later
            timestamp: participant.timestamp,
        }));

        // Get the display names of the participants from Firestore and populate the display_name field
        const firestorePromises = participants.map((participant, index) => {
            return admin
                .firestore()
                .collection('Users')
                .doc(participant.user.uid)
                .get()
                .then((firestoreUserDoc) => {
                    const { displayName } = firestoreUserDoc.data();
                    participantsData[index].display_name = displayName;
                });
        });

        // Wait for all Firestore requests to complete
        await Promise.all(firestorePromises);

        // return the participants data in the desired format
        res.status(200).json(participantsData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to get event participants' });
    }
}
module.exports = getEventParticipants;
