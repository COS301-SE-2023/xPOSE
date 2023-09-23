const { User, Event, EventInvitation, EventParticipant, Tag, EventTag } = require('../data-access/sequelize');
const uploadImageToFirebase = require('../data-access/firebase.repository');
const admin = require('firebase-admin');
const { generateUniqueCode, EventBuilder } = require('../libs/Events');

async function createEvent(req, res) {
    try {
        console.log('Received request to create event.');

        const { uid } = req.query;
        const { title, description, location, latitude, longitude, start_date, end_date, privacy_setting, tags } = req.body;
        const imageFile = req.file;

        console.log('Received data:');
        console.log('UID:', uid);
        console.log('Title:', title);
        console.log('Description:', description);
        console.log('Location:', location);
        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
        console.log('Start Date:', start_date);
        console.log('End Date:', end_date);
        console.log('Privacy Setting:', privacy_setting);
        console.log('Tags:', tags);

        // Check if the required fields are provided
        if (!uid || !title || !description || !location || !latitude || !longitude || !start_date || !end_date || !privacy_setting) {
            console.log('Missing required fields.');
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        // Check if the privacy setting is valid
        if (privacy_setting !== 'public' && privacy_setting !== 'private') {
            console.log('Invalid privacy setting:', privacy_setting);
            res.status(400).json({ error: 'Invalid privacy setting' });
            return;
        }

        // Check if the start date is before the end date
        if (new Date(start_date) > new Date(end_date)) {
            console.log('Start date must be before end date.');
            res.status(400).json({ error: 'Start date must be before end date' });
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
            console.log('User with UID', uid, 'does not exist. Creating user...');
            const firestoreUserDoc = await admin.firestore().collection('Users').doc(uid).get();

            if (firestoreUserDoc.exists) {
                // Create the user in the Users table
                user = await User.create({ uid: uid });
                console.log('User created with ID:', user.id);
            } else {
                console.log('Invalid user.');
                res.status(400).json({ error: 'Invalid user' });
                return;
            }
        }

        // Upload image to Firebase and get the image URL
        let image_url = '';
        if (imageFile) {
            console.log('Uploading image to Firebase...');
            image_url = await uploadImageToFirebase(uid, imageFile);
            console.log('Image uploaded. URL:', image_url);
        } else {
            // Default image
            image_url = "https://firebasestorage.googleapis.com/v0/b/xpose-4f48c.appspot.com/o/Defaults%2Fdefault-event-cover.png?alt=media&token=6a058d10-7329-4648-b02f-ce84151af75f";
        }

        let status = '';
        const obj_start_date = new Date(start_date);
        const obj_end_date = new Date(end_date);
        if (Date.now() < obj_start_date) {
            status = 'upcoming';
        } else if (Date.now() >= obj_start_date && Date.now() <= obj_end_date) {
            status = 'ongoing';
        } else {
            status = 'ended';
        }

        // Build the event object
        console.log('Creating event...');
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
        console.log('Event created with ID:', event.id);

        // Create an array to store the tag models
        const tagModels = [];

        // Check if tags are provided and create them if necessary
        if (tags && tags.length > 0) {
            console.log('Creating tags...');
            for (const tagName of tags) {
                // Try to find the tag by name
                let tag = await Tag.findOne({
                    where: { tag_name: tagName.toLowerCase() },
                });

                // If the tag doesn't exist, create it
                if (!tag) {
                    tag = await Tag.create({ tag_name: tagName.toLowerCase() });
                    console.log('Tag created with ID:', tag.id);
                }

                // Create an entry in the event_tags table to associate the event with the tag
                await EventTag.create({
                    event_id_fk: event.id,
                    tag_id_fk: tag.id,
                });

                // Add the tag model to the array
                tagModels.push(tag);
            }
            console.log('Tags created:', tagModels);
        }

        // Add the owner as a participant to the event
        await EventParticipant.create({
            user_id_fk: user.id,
            event_id_fk: event.id,
            timestamp: Date.now(),
        });

        // Create Event-Chat document in Firestore with the same id as the event
        console.log('Creating Event-Chat document in Firestore...');
        await admin.firestore().collection('Event-Chats').doc(event.code.toString()).set({});
        console.log('Event-Chat document created.');

        // Create Event-Post document in Firestore with the same id as the event
        console.log('Creating Event-Post document in Firestore...');
        await admin.firestore().collection('Event-Posts').doc(event.code.toString()).set({});
        console.log('Event-Post document created.');

        console.log('Event creation successful.');
        res.json(event);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to create an event' });
    }
}

module.exports = createEvent;
