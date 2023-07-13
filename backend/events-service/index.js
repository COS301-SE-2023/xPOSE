const express = require('express');
const { sequelize, User, Event } = require('./data-access/sequelize');
const { Op } = require('sequelize');
const uploadImageToFirebase = require('./data-access/firebase.repository');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { generateUniqueCode, EventBuilder } = require('./libs/Events');

// Initialize Express app
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// Create an event
app.post('/events',  upload.single('image'), async (req, res) => {
    try {
        const eventBuilder = new EventBuilder();
        const imageFile = req.file;
        let image_url = await uploadImageToFirebase(req.body.uid, imageFile);

        // find the user with the uid and get the id
        const user = await User.findOne({
            where: {
                uid: req.body.uid
            }
        });

        // Build the event object
        const event = eventBuilder.withTitle(req.body.title)
        .withOwnwerId(user.id)
        .withCode(generateUniqueCode())
        .withDescription(req.body.description)
        .withLatitude(req.body.latitude)
        .withLongitude(req.body.longitude)
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
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
});

// Get a single event by ID
app.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve the event' });
  }
});

// Update an event
app.put('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (event) {
      await event.update(req.body);
      res.json(event);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update the event' });
  }
});

// Delete an event
app.delete('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (event) {
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

// Start the server
sequelize.sync({ force: true }) // Replace `force: true` with `force: false` in production
  .then(() => {
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch((error) => {
    console.error('Failed to start the server:', error);
});
