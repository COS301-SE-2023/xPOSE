const { sequelize, User, Event, EventInvitation, EventParticipant, EventJoinRequest } = require('../data-access/sequelize');
const uploadImageToFirebase = require('../data-access/firebase.repository');
const admin = require('firebase-admin');

async function getEvent(req, res) {
    try {
        const { uid } = req.query;

        if(!uid) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        // Find the user with the provided uid
        let user = await User.findOne({
            where: {
                uid: uid,
            },
        });

        // If user doesn't exist, create them
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

        const event = await Event.findOne({
            where: {
                code: req.params.code
            },
            include: {
                model: User,
                attributes: ['uid'],
                as: 'owner'
            }
        });

        if (event) {
            const { owner_id_fk, ...eventData } = event.toJSON();
        
            // Get the display name of the owner of the event from firestore
            const firestoreUserDoc = await admin.firestore().collection('Users').doc(event.owner.uid).get();
            // Get displayName from the firestore document
            const { displayName } = firestoreUserDoc.data();
            // Add displayName to the event data
            eventData.owner_display_name = displayName;
          // Check if user is the owner
          if (user.id === owner_id_fk) {
            eventData.user_event_position = 'owner';
          } else {
            let participant = await EventParticipant.findOne({
              where: {
                user_id_fk: user.id,
                event_id_fk: event.id,
              },
            });
        
            if (participant) {
              eventData.user_event_position = 'participant';
            } else {
              let joinRequest = await EventJoinRequest.findOne({
                where: {
                  user_id_fk: user.id,
                  event_id_fk: event.id,
                  response: 'pending',
                },
              });
        
              if (joinRequest) {
                eventData.user_event_position = 'requested';
              } else {
                let invitation = await EventInvitation.findOne({
                  where: {
                    user_id_fk: user.id,
                    event_id_fk: event.id,
                    response: 'pending',
                  },
                });
        
                if (invitation) {
                  eventData.user_event_position = 'invited';
                } else {
                  eventData.user_event_position = 'none';
                }
              }
            }
          }

            eventData.owner = event.owner.uid;
            res.json(eventData);
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve the event' });
    }
}

module.exports = getEvent;
