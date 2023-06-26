const express = require('express');
// const axios = require('axios');
const multer = require('multer');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const fs = require('fs');
const uploadImageToFirebase = require('./firebase-storage.service');
const generateUniqueCode = require('./code-generator');
// const qr = require('qrcode');
const cors = require('cors');

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
app.use(cors());

// Configure Multer for file upload
const upload = multer({ dest: 'uploads/' });

// Define routes

// Hello world route
app.get('/status', (req, res) => {
  console.log('Received request from:', req.ip);
  res.send('Hello World!');
});

// Create event route
app.post('/events', upload.single('coverImage'), async (req, res) => {
  console.log('Processing event creation');
  
  try {
    const { eventName, eventDescription, eventLocation, userId, eventStartDate, eventEndDate, eventPrivacySetting } = req.body;
    console.log('Request body:', req.body);
    console.log('Event name:', eventName);
    console.log('Event description:', eventDescription);
    console.log('Event location:', eventLocation);
    console.log('Event start date:', eventStartDate);
    console.log('Event end date:', eventEndDate);
    console.log('Event privacy setting:', eventPrivacySetting);
    console.log('User ID:', userId);
    console.log('File:', req.file)
    
    const file = req.file;
     
    const imageUrl = await uploadImageToFirebase(userId, file);        

    // Generate a unique file name
    const fileName = `${userId}_${Date.now()}_${file.originalname}`;

    // Save the event in Firebase Firestore
    const db = admin.firestore();
    const eventsRef = db.collection('events');
    const eventCode = generateUniqueCode();
    const userRef = db.collection('Users').doc(userId);
    const event = {
      eventName,
      eventDescription,
      eventLocation,
      eventCreator: userId,
      eventStartDate: new Date(eventStartDate),
      eventEndDate: new Date(eventEndDate),
      imageUrl,
      eventPrivacySetting,
      eventCode
    };
    
    const { id } = await eventsRef.add(event);
    // add event id to user's subcollection of created events
    // await userRef.collection('joinedEvents').doc(id).set({});

    console.log('Event created:', id);
    // Return the created event
    res.json({ id, ...event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Error creating event' });
  }
});

// Update event route
app.put('/events/:eventId', async (req, res) => {
  console.log('Processing event update');
  try {
    const { eventId } = req.params;
    const { eventName, eventDescription, eventLocation, eventStartDate, eventEndDate } = req.body;

    const db = admin.firestore();
    const eventRef = db.collection('events').doc(eventId);

    await eventRef.update({
      eventName,
      eventDescription,
      eventLocation,
      eventStartDate: new Date(eventStartDate),
      eventEndDate: new Date(eventEndDate),
    });

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Error updating event' });
  }
});

// Get all events route
app.get('/events', async (req, res) => {
  console.log('Processing event retrieval');

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
  console.log('Processing event deletion');
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
  console.log('Processing adding participant to event');
  try {
    const { eventId } = req.params;
    const { userId } = req.body;

    const db = admin.firestore();
    const eventRef = db.collection('events').doc(eventId);
    const userRef = db.collection('Users').doc(userId);

    await eventRef.collection('participants').doc(userId).set({});
    await userRef.collection('joinedEvents').doc(eventId).set({});

    res.json({ message: 'Participant added successfully' });
  } catch (error) {
    console.error('Error adding participant:', error);
    res.status(500).json({ error: 'Error adding participant' });
  }
});

// Add post to event route
app.post('/events/:eventId/posts', async (req, res) => {
  console.log('Processing adding post to event');
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
  console.log('Processing adding chat message to event');
  try {
    const { eventId } = req.params;
    const { userId, message } = req.body;

    const db = admin.firestore();
    const eventRef = db.collection('events').doc(eventId);
    const userRef = db.collection('Users').doc(userId);

    // get user displayName
    const userSnapshot = await userRef.get();
    const { displayName } = userSnapshot.data();
    await eventRef.collection('chats').add({ userId, displayName, message });

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
