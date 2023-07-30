const { sequelize, User, Event, EventInvitation, EventParticipant, EventJoinRequest } = require('../data-access/sequelize');
const uploadImageToFirebase = require('../data-access/firebase.repository');
const admin = require('firebase-admin');

async function getEvents(req, res) {
    try {
        const { uid, filter } = req.query;
      
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
        
        // find all the events if the filter is set to 'all'
        let events = [];

        // if filter is not set, set it to 'all'
        if (!filter) {
            events = await Event.findAll({
               include: {
                   model: User,
                   attributes: ['uid'], 
                   as: 'owner',
               },
           });
        }
        // find all the events the user is a participant of if the filter is set to 'participant'
        else if (filter === 'participant') {
            const participantEvents = await EventParticipant.findAll({
                where: {
                    user_id_fk: user.id,
                },
            });

            const participantEventIds = participantEvents.map((event) => event.event_id_fk);

            events = await Event.findAll({
                where: {
                    id: participantEventIds,
                },
                include: {
                    model: User,
                    attributes: ['uid'],
                    as: 'owner',
                },
            });
        }

        // Transform the events to replace 'owner_id_fk' with 'uid'
        const transformedEvents = [];
        for (let i = 0; i < events.length; i++) {
          const event = events[i];
          // update event status
          let status = '';
          const obj_start_date = new Date(event.start_date);
          const obj_end_date = new Date(event.end_date);
          if (Date.now() < obj_start_date) {
            status = 'upcoming';
          } else if (Date.now() >= obj_start_date && Date.now() <= obj_end_date) {
            status = 'ongoing';
          } else {
            status = 'ended';
          }

          const { owner_id_fk, ...eventData } = event.toJSON();
        
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
          transformedEvents.push(eventData);
        }

        res.json(transformedEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
}

module.exports = getEvents;
