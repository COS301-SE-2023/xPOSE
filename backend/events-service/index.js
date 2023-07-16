const express = require('express');
const { sequelize, User, Event, EventInvitation } = require('./data-access/sequelize');
const { Op } = require('sequelize');
const uploadImageToFirebase = require('./data-access/firebase.repository');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { generateUniqueCode, EventBuilder } = require('./libs/Events');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
// Initialize Express app
const cors = require('cors');
const app = express();
// app.use(express.json());
app.use(cors());
// app.use(bodyParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Create an event
app.post('/events', upload.single('image'), async (req, res) => {
    try {
        console.log('-------------------------');
        // const eventBuilder = new EventBuilder();
        const imageFile = req.file;
        // let image_url = await uploadImageToFirebase(req.body.uid, imageFile);
        console.log(imageFile);
        console.log('-------------------------');
        console.log(req.body);
        // if user doesn't exist, then create them if they exist in firebase
        const eventBuilder = new EventBuilder();
        let image_url = await uploadImageToFirebase(req.body.uid, req.file);

        // find the user with the uid and get the id
        let user = await User.findOne({
            where: {
                uid: req.body.uid
            }
        });

        if(user === undefined || user === null) {
            user = await User.create({ uid: req.body.uid });
        }

        // Build the event object
        console.log(req.body);
        const event = eventBuilder.withTitle(req.body.title)
            .withOwnerId(user.id)
            .withCode(generateUniqueCode())
            .withDescription(req.body.description)
            .withLatitude(req.body.latitude)
            .withLongitude(req.body.longitude)
            .withStartDate(req.body.start_date)
            .withEndDate(req.body.end_date)
            .withImageUrl(image_url)
            .withPrivacySetting(req.body.privacy_setting)
            .withTimestamp(Date.now())
            .build();

        // Save the event to the database
        await Event.create(event);

        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create an event' });
    }
});

// Get all events
app.get('/events', async (req, res) => {
    try {
        const events = await Event.findAll({
            include: {
                model: User,
                attributes: ['uid'], 
                as: 'owner',
            },
        });

        // Transform the events to replace 'owner_id_fk' with 'uid'
        const transformedEvents = events.map(event => {
            const { owner_id_fk, ...eventData } = event.toJSON();
            eventData.owner = event.owner.uid;
            return eventData;
        });

        res.json(transformedEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
  });

// Get a single event by code
app.get('/events/:code', async (req, res) => {
    try {
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
            eventData.owner = event.owner.uid;
            res.json(eventData);
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve the event' });
    }
});

// Update an event
app.put('/events/:code', upload.single('image'), async (req, res) => {
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
});
  

// Delete an event
app.delete('/events/:code', upload.none(), async (req, res) => {
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
});

// Invite user
app.post('/events/:code/invite/', upload.none(), async (req, res) => {
    try {
        console.log(`Request headers: ${JSON.stringify(req.headers)}`);
        console.log(`Request body: ${JSON.stringify(req.body)}`);
        console.log(`Request params: ${JSON.stringify(req.params)}`);

        const { uid } = req.body;
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

        // Find the event with the provided eventId
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
});

// response from invited user
app.put('/events/invite/:code', async (req, res) => {
    res.status
});

// user requesting to join
app.post('/events/request/:uid', async (req, res) => {
    res.status(500).json({ error: 'Not ready'});
});

// response to the user request to join
app.put('/events/request/:code', async (req, res) => {
    // some rabbitmq action here
    res.status(500).json({ error: 'Not ready' });
});

// remove user
app.delete('/events/remove/:uid', async (req, res) => {
    res.status(500).json({ error: 'Not ready' });
});

// Start the server
sequelize
.sync({ force: false }) // Replace `force: true` with `force: false` in production
.then(() => {
    app.listen(8004, () => {
        console.log('Server started on port 8004');
    });
})
.catch((error) => {
    console.error('Failed to start the server:', error);
});
