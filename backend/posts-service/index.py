from datetime import timedelta
from flask import Flask, request, jsonify
import face_recognition
import numpy as np
import firebase_admin
from firebase_admin import credentials, storage, firestore
import os
import random
import string
import json
from db_connector import db, User  # Import the database models
from PIL import Image as PILImage, ImageFilter
import io


app = Flask(__name__)

# Initialize Firebase Admin SDK
cred = credentials.Certificate('./permissions.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'xpose-4f48c.appspot.com',  # Use only the bucket name here
    'databaseURL': 'https://xpose-4f48c-default-rtdb.firebaseio.com'
})

def generate_registration_form():
    return '''
    <form method="post" action="/register" enctype="multipart/form-data">
        <label for="user_id">User ID:</label><br>
        <input type="text" id="user_id" name="user_id" required><br><br>
        <input type="file" name="image" accept=".jpg, .jpeg, .png" required><br><br>
        <input type="submit" value="Register User">
    </form>
    '''

def generate_detection_form():
    return '''
    <form method="post" action="/detect" enctype="multipart/form-data">
        <input type="file" name="image" accept=".jpg, .jpeg, .png" required><br><br>
        <input type="submit" value="Detect Users">
    </form>
    '''
def generate_upload_form():
    return '''
    <form method="post" action="/upload" enctype="multipart/form-data">
        <label for="user_id">User ID:</label><br>
        <input type="text" id="user_id" name="user_id" required><br><br>
        <input type="file" name="image" accept=".jpg, .jpeg, .png" required><br><br>
        <input type="submit" value="Upload Photo">
    </form>
    '''

@app.route('/register', methods=['GET', 'POST'])
def register_user():
    if request.method == 'GET':
        return generate_registration_form()
    try:
        # Load the image
        image = PILImage.open(request.files['image'])
        
        # Calculate the new dimensions by increasing both width and height
        original_width, original_height = image.size
        new_width = int(original_width / 0.7)
        new_height = int(original_height / 0.7)
        
        # Resize the image to the new dimensions
        image = image.resize((new_width, new_height), PILImage.ANTIALIAS)
        
        # Convert the resized image to a numpy array
        image_array = np.array(image)

        # Perform face detection on the resized image
        face_encodings = face_recognition.face_encodings(image_array)
        
        if len(face_encodings) == 0:
            return jsonify({'error': 'No faces were detected in the provided image'}), 400

        encoding = face_encodings[0]  # Assuming there's at least one face

        user_id = request.form['user_id']
        
        # Serialize the encoding array to a JSON string
        encoding_json = json.dumps(encoding.tolist())

        # Create a new user and save their encoding in the database
        new_user = User.create(uid=user_id, face_encoding=encoding_json)
        
        return jsonify({'message': 'User registered successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@app.route('/detect', methods=['GET', 'POST'])
def detect_users():
    if request.method == 'GET':
        return generate_detection_form()
    try:
        image = face_recognition.load_image_file(request.files['image'])
        face_locations = face_recognition.face_locations(image)
        face_encodings = face_recognition.face_encodings(image, face_locations)

        detected_users = []

        # Retrieve all users from the database
        all_users = User.select()

        # Set the tolerance level (this needs some adjusting)
        tolerance = 0.5

        for face_encoding in face_encodings:
            for user in all_users:
                # Parse the stored JSON string back to a numpy array
                stored_encoding = np.array(json.loads(user.face_encoding))
                
                # Compare the face encodings with the specified tolerance
                is_match = face_recognition.compare_faces([stored_encoding], face_encoding, tolerance=tolerance)[0]
                
                if is_match:
                    detected_users.append(user.uid)


        return jsonify({'detected_users': detected_users})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
if __name__ == '__main__':
    app.run(debug=True)
