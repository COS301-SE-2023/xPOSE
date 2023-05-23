import unittest
import requests

class CreateEventAPITest(unittest.TestCase):
    def setUp(self):
        self.base_url = 'http://localhost:5000/api/create-event'
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

if __name__ == '__main__':
    unittest.main()
