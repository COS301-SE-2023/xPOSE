import unittest
import requests

class CreateEventAPITest(unittest.TestCase):
    def setUp(self):
        self.base_url = 'http://localhost:5000/api/create-event'
        self.events_url = 'http://localhost:5000/api/events'
        self.event_name = 'Test Event'
        self.event_desc = 'This is a test event'
        self.image_path = './image.jpg'

    def test_create_event(self):
        # Prepare the payload and files
        payload = {
            'eventName': self.event_name,
            'eventDesc': self.event_desc,
        }
        files = {'coverImage': open(self.image_path, 'rb')}

        # Send POST request to create an event
        response = requests.post(self.base_url, data=payload, files=files)

        # Assert the response
        self.assertEqual(response.status_code, 201)
        self.assertIn('Event created successfully', response.json()['message'])
        self.assertEqual(response.json()['event_name'], self.event_name)
        self.assertEqual(response.json()['event_desc'], self.event_desc)

    def test_get_events(self):
        # Send GET request to retrieve events
        response = requests.get(self.events_url)

        # Assert the response
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), dict)
        self.assertGreaterEqual(len(response.json()), 0)

    def test_get_events_empty(self):
        # Clear the events JSON file
        open('events.json', 'w').close()

        # Send GET request to retrieve events
        response = requests.get(self.events_url)

        # Assert the response
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), dict)
        self.assertEqual(len(response.json()), 0)

if __name__ == '__main__':
    unittest.main()
