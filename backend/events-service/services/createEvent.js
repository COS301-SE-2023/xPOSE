const { sequelize, User, Event, EventInvitation, EventParticipant, EventJoinRequest } = require('../data-access/sequelize');
const uploadImageToFirebase = require('../data-access/firebase.repository');
const admin = require('firebase-admin');
const { generateUniqueCode, EventBuilder } = require('../libs/Events');

async function createEvent(req, res) {
    try {
        const { uid, title, description, location, latitude, longitude, start_date, end_date, privacy_setting } = req.body;
        const imageFile = req.file;

        // Check if the required fields are provided
        if (!uid || !title || !description || !location || !latitude || !longitude || !start_date || !end_date || !privacy_setting) {

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

        // Upload image to Firebase and get the image URL
        let image_url = '';
        if (imageFile) {
            image_url = await uploadImageToFirebase(uid, imageFile);
        }
        else{
            image_url = "https://e0.pxfuel.com/wallpapers/286/336/desktop-wallpaper-random-things-i-cant-explain-eggdog.jpg";
        }

        let status = '';
        if (Date.now() < start_date) {
            status = 'upcoming';
        } else if (Date.now() >= start_date && Date.now() <= end_date) {
            status = 'ongoing';
        } else {
            status = 'finished';
        }

        // Build the event object
        const event = await Event.create({
            title: title,
            description: description,
            location: location,
            latitude: latitude,
            longitude: longitude,
            start_date: start_date,
            end_date: end_date,
            privacy_setting: privacy_setting,
            image_url: image_url,
            timestamp: Date.now(),
            owner_id_fk: user.id,
            code: generateUniqueCode(),
            status: status,
        });

        // Add the owner as a participant to the event
        await EventParticipant.create({
            user_id_fk: user.id,
            event_id_fk: event.id,
            timestamp: Date.now(),
        });

        // Create Event-Chat document in Firestore with the same id as the event
        await admin.firestore().collection('Event-Chats').doc(event.code.toString()).set({});

        // Create Event-Post document in Firestore with the same id as the event
        await admin.firestore().collection('Event-Posts').doc(event.code.toString()).set({});

        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create an event' });
    }
}

module.exports = createEvent;
