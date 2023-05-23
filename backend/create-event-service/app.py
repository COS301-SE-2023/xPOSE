from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Endpoint for creating an event
@app.route('/api/create-event', methods=['POST'])
def create_event():
    try:
        # Retrieve form data
        event_name = request.form.get('eventName')
        event_desc = request.form.get('eventDesc')
        cover_image = request.files['coverImage']

        # Save event data to text file
        event_data = f"Event Name: {event_name}\nEvent Description: {event_desc}"
        with open('event_data.txt', 'w') as file:
            file.write(event_data)

        # Save image file to the same directory
        image_path = os.path.join(app.root_path, cover_image.filename)
        cover_image.save(image_path)

        # Return success response
        response = {
            'message': 'Event created successfully',
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

if __name__ == '__main__':
    app.run(debug=True)
