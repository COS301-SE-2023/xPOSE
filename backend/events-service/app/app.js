const express = require('express');
const axios = require('axios');
const multer = require('multer');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const fs = require('fs');
const uploadImageToFirebase = require('./firebase-storage.service');
const generateUniqueCode = require('./code-generator');
const qr = require('qrcode');

// Initialize Firebase Admin SDK
const serviceAccount = require('./permissions.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://xpose-4f48c-default-rtdb.firebaseio.com',
  storageBucket: 'gs://xpose-4f48c.appspot.com',
});

// Create Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Multer for file upload
const upload = multer({ dest: 'uploads/' });

// Define routes

// Hello world route
app.get('/status', (req, res) => {
  res.send('Hello World!');
});

// Create event route
// Create event route
app.post('/events', upload.single('image'), async (req, res) => {
    try {
      const { name, description, location, userId, startDate, endDate, privacySetting } = req.body;
      const file = req.file;
       
      const imageUrl = await uploadImageToFirebase(userId, file);        

      // Generate a unique file name
      const fileName = `${userId}_${Date.now()}_${file.originalname}`;
    
      // Upload the file to the image uploader API
      //   const uploadUrl = 'http://localhost:8003/upload';
      //   const formData = new FormData();
      //   formData.append('userId', userId);
      //   formData.append('file', fs.createReadStream(file.path));
    
      //   const headers = formData.getHeaders ? formData.getHeaders() : { 'Content-Type': 'multipart/form-data' };
    
      //   const { data: { url: imageUrl } } = await axios.post(uploadUrl, formData, {
      //     headers,
      //   });
  
      // Save the event in Firebase Firestore
      const db = admin.firestore();
      const eventsRef = db.collection('events');
      const eventCode = generateUniqueCode();
      // qr.toFile(`./qr-codes/${eventCode}.png`, eventCode, { width: 500 });
      // const qrCodeUrl = uploadImageToFirebase(userId, { path: `./qr-codes/${eventCode}.png`, originalname: `${eventCode}.png` }})
      // .then((url) => {
      //   return url;
      // })
      // .catch((error) => {
      //   console.error('Error uploading QR code:', error);
      // });

      
      const event = {
        name,
        description,
        location,
        owner: userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        imageUrl,
        userId,
        privacySetting,
        eventCode
      };
  
      const { id } = await eventsRef.add(event);
  
      // Return the created event
      res.json({ id, ...event });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Error creating event' });
    }
  });
  

// Update event route
app.put('/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, description, location, startDate, endDate } = req.body;

    const db = admin.firestore();
    const eventRef = db.collection('events').doc(eventId);

    await eventRef.update({
      name,
      description,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Error updating event' });
  }
});

// Get all events route
app.get('/events', async (req, res) => {
    try {
        const db = admin.firestore();
        const eventsRef = db.collection('events');
        const snapshot = await eventsRef.get();
        const events = [];
        snapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() });
        });
        res.json(events);
    } catch (error) {
        console.error('Error getting events:', error);
        res.status(500).json({ error: 'Error getting events' });
    }
});

// Delete event route
app.delete('/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    const db = admin.firestore();
    const eventRef = db.collection('events').doc(eventId);

    await eventRef.delete();

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Error deleting event' });
  }
});

// Add participant to event route
app.post('/events/:eventId/participants', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;

    const db = admin.firestore();
    const eventRef = db.collection('events').doc(eventId);

    await eventRef.collection('participants').doc(userId).set({});

    res.json({ message: 'Participant added successfully' });
  } catch (error) {
    console.error('Error adding participant:', error);
    res.status(500).json({ error: 'Error adding participant' });
  }
});

// Add post to event route
app.post('/events/:eventId/posts', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, content } = req.body;

    const db = admin.firestore();
    const eventRef = db.collection('events').doc(eventId);

    await eventRef.collection('posts').add({ userId, content });

    res.json({ message: 'Post added successfully' });
  } catch (error) {
    console.error('Error adding post:', error);
    res.status(500).json({ error: 'Error adding post' });
  }
});

// Add chat message to event route
app.post('/events/:eventId/chats', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, message } = req.body;

    const db = admin.firestore();
    const eventRef = db.collection('events').doc(eventId);

    await eventRef.collection('chats').add({ userId, message });

    res.json({ message: 'Chat message added successfully' });
  } catch (error) {
    console.error('Error adding chat message:', error);
    res.status(500).json({ error: 'Error adding chat message' });
  }
});

// Start the server
const port = 8004;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
