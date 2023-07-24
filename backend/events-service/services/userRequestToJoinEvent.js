const { sequelize, User, Event, EventInvitation, EventParticipant, EventJoinRequest } = require('../data-access/sequelize');
const uploadImageToFirebase = require('../data-access/firebase.repository');
const admin = require('firebase-admin');
const { sendMessageToQueue } = require('../libs/sender');

async function userRequestToJoinEvent(req, res) {
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

        // Check if the user has already sent a join request for the event
        const existingRequest = await EventJoinRequest.findOne({
            where: {
                user_id_fk: user.id,
                event_id_fk: event.id,
            },
        });

        if (existingRequest) {
            res.status(400).json({ error: 'User has already sent a join request for the event' });
            return;
        }

        // Create a new join request
        const joinRequest = await EventJoinRequest.create({
            user_id_fk: user.id,
            event_id_fk: event.id,
            response: 'pending',
            timestamp: new Date(),
        });

        // send message to notification queue using rabbitmq
        const message = {
            responses: ['accepted', 'rejected'],
            data: {
                join_request_id: joinRequest.id,
                type: 'event_join_request',
                receiverId: user.uid,
                event_name: event.name,
                event_code: event.code,
            }
        };

        sendMessageToQueue('notifications', message);

        res.json(joinRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process the join request' });
    }
}

module.exports = userRequestToJoinEvent;
