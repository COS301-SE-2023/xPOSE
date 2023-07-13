const express = require('express');
const {sequelize} = require('./data-access/sequelize');
const { Op } = require('sequelize');
const uploadImageToFirebase = require('./data-access/firebase.repository');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


// Initialize Express app
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// Create an event
app.post('/events',  upload.single('image'), async (req, res) => {
    try {
        console.log(req.file);
        // Generate unique event code
        const eventCode = generateUniqueCode();
        console.log(`eventCode: ${eventCode}`);

        // Generate unique timestamp
        const timestamp = generateUniqueTimestamp();
        console.log(`timestamp: ${timestamp}`);

        // Extract the image file from the request
        const imageFile = req.file;
        console.log(`imageFile: ${imageFile}`);

        // Remove image file metadata
        // if (imageFile) {
        //   delete imageFile.data;
        // }

        console.log(`image meta data removed`);
  
        // Upload image to Firebase Storage
        let imageUrl = await uploadImageToFirebase(req.body.owner_id_fk, imageFile);
        console.log(`imageUrl: ${imageUrl}`);

        // Create the event
        const event = await Event.create({
            ...req.body,
            code: eventCode,
            timestamp,
            image_url: imageUrl,
        });

        console.log(`event: ${event}`);

        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create an event' });
    }
});
  
function generateUniqueCode() {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base-36 string
    const randomString = Math.random().toString(36).substr(2, 5); // Generate a random alphanumeric string
  
    const uniqueCode = timestamp + randomString; // Combine the timestamp and random string
  
    return uniqueCode;
  }
  
// Helper function to generate a unique timestamp
function generateUniqueTimestamp() {
    // Generate a timestamp with millisecond precision
    const timestamp = Date.now();
  
    return timestamp;
  }

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
