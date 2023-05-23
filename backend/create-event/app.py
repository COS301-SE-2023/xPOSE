from flask import Flask, request, jsonify
import os
import json
import random
import string

app = Flask(__name__)

# Endpoint for creating an event
@app.route('/api/create-event', methods=['POST'])
def create_event():
    try:
        # Retrieve form data
        event_name = request.form.get('eventName')
        event_desc = request.form.get('eventDesc')
        cover_image = request.files['coverImage']

        # Create "images" directory if it doesn't exist
        images_dir = os.path.join(os.getcwd(), 'images')
        if not os.path.exists(images_dir):
            os.makedirs(images_dir)

        # Generate a random event ID
        event_id = generate_event_id()

        # Generate a random image filename
        image_filename = str(random.randint(1000, 9999)) + cover_image.filename

        # Save event data to JSON file
        event_data = {
            'event_name': event_name,
            'event_desc': event_desc,
            'event_path': image_filename
        }
        add_event_to_json(event_id, event_data)

        # Save image file in the "images" directory
        image_path = os.path.join(images_dir, image_filename)
        cover_image.save(image_path)

        # Return success response
        response = {
            'message': 'Event created successfully',
            'event_id': event_id,
            'event_name': event_name,
            'event_desc': event_desc,
        }
        return jsonify(response), 201

    except Exception as e:
        # Return error response
        response = {
            'message': 'An error occurred while creating the event',
            'error': str(e),
        }
        return jsonify(response), 500


# Helper function to generate a random event ID
def generate_event_id():
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(random.choice(letters_and_digits) for _ in range(8))


# Helper function to add event data to the JSON file
def add_event_to_json(event_id, event_data):
    events = {}

    # Check if the JSON file exists
    if os.path.exists('events.json'):
        with open('events.json', 'r') as file:
            events = json.load(file)

    # Add event data with event ID as key
    events[event_id] = event_data

    # Write the updated data to the JSON file
    with open('events.json', 'w') as file:
        json.dump(events, file)


# Endpoint for getting all events
@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        events = {}

        # Check if the JSON file exists
        if os.path.exists('events.json'):
            with open('events.json', 'r') as file:
                events = json.load(file)

        # Return events
        return jsonify(events), 200

    except Exception as e:
        # Return error response
        response = {
            'message': 'An error occurred while retrieving events',
            'error': str(e),
        }
        return jsonify(response), 500


if __name__ == '__main__':
    app.run()
