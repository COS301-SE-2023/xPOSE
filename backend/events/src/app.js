// express api for events, creating, updating, deleting, and getting events

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// use cors and body parser
app.use(cors());
app.use(bodyParser.json());

// get events
app.get('/events', (req, res) => {
    // we will use firebase to connect to this
    const events = {
        "events": [
          {
            "event_id": "c95104a7-6ab3-4a91-8e8b-3c567d12efc1",
            "event_name": "Birthday Party",
            "cover_image_url": "https://via.placeholder.com/500x300",
            "start_date": "2023-06-10T14:00:00Z",
            "end_date": "2023-06-10T18:00:00Z",
            "visibility": "public",
            "location": "123 Main Street",
            "message_board_settings": "enabled",
            "owner_id": "a617d69e-25ab-421b-8dd6-8a0623dcb42f"
          },
          {
            "event_id": "ab0e0a5d-9b2b-4f8e-9f52-fac502b9dce5",
            "event_name": "Wedding Anniversary",
            "cover_image_url": "https://via.placeholder.com/500x300",
            "start_date": "2023-07-15T18:00:00Z",
            "end_date": "2023-07-16T00:00:00Z",
            "visibility": "private",
            "location": "456 Elm Street",
            "message_board_settings": "disabled",
            "owner_id": "cd4f9431-6fc2-4f15-8e06-90c36eab73c9"
          },
          {
            "event_id": "f8ef1491-7485-4de4-8f72-7a8b161d4471",
            "event_name": "Family Reunion",
            "cover_image_url": "https://via.placeholder.com/500x300",
            "start_date": "2023-08-20T10:00:00Z",
            "end_date": "2023-08-22T18:00:00Z",
            "visibility": "public",
            "location": "789 Oak Street",
            "message_board_settings": "enabled",
            "owner_id": "a617d69e-25ab-421b-8dd6-8a0623dcb42f"
          }
        ]
      };

    res.json(events);
});

// get event by id
app.get('/events/:id', (req, res) => {
    // we will use firebase to connect to this
    const event = {
        "_id": "1",
        "name": "Auto Expo",
        "description": "lorem ipsum",
        "date": "2012-04-23T18:25:43.511Z"
    };

    res.json(event);
});

// post event
app.post('/events', (req, res) => {
    // we will use firebase to connect to this
    const event = req.body;
    res.json(event);
});

// update event
app.put('/events/:id', (req, res) => {
    // we will use firebase to connect to this
    const event = req.body;
    res.json(event);
});

// delete event
app.delete('/events/:id', (req, res) => {
    // we will use firebase to connect to this
    const event = req.body;
    res.json(event);
});

app.listen(port, () => console.log(`Events app listening on port ${port}!`));
