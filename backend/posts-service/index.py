from datetime import timedelta
from flask import Flask, request, jsonify
import face_recognition
import numpy as np
import firebase_admin
from firebase_admin import credentials, storage, firestore
import os
import random
import string
app = Flask(__name__)

# Store user encodings in a dictionary for now (replace with a database later)
user_encodings = {}

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
        image = face_recognition.load_image_file(request.files['image'])
        encoding = face_recognition.face_encodings(image)[0]
        user_id = request.form['user_id']
        user_encodings[user_id] = encoding.tostring()  # Convert encoding to string for storage
        print("User ID", user_id, " - Encoding: ", encoding)
        print("\n")
        print("Face encodings", user_encodings)
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

        for face_encoding in face_encodings:
            for user_id, user_encoding in user_encodings.items():
                user_encoding = np.fromstring(user_encoding, dtype=np.float64)
                if face_recognition.compare_faces([user_encoding], face_encoding)[0]:
                    detected_users.append(user_id)

        return jsonify({'detected_users': detected_users})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
def generate_random_filename():
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for _ in range(10)) + '.jpg'

@app.route('/upload', methods=['GET', 'POST'])
def upload_photo():
    if request.method == 'GET':
        return generate_upload_form()
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        image = request.files['image']
        if image.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Generate a random filename for the image
        random_filename = generate_random_filename()

        # Upload the image to Firebase Storage with the random filename
        bucket = storage.bucket()
        blob = bucket.blob(random_filename)
        blob.upload_from_string(image.read())

        # Get the public URL of the uploaded file
        url = blob.generate_signed_url(
            version='v4',
            expiration=timedelta(days=1),  # Adjust the expiration as needed
            method='GET')

        # Save the file record in the Firestore
        db = firestore.client()  # Initialize Firestore
        image_ref = db.collection('test').document()
        image_data = {
            'fileName': random_filename,
            'url': url,
            'createdAt': firestore.SERVER_TIMESTAMP
        }
        image_ref.set(image_data)

        return jsonify({'message': 'Photo uploaded successfully', 'image_filename': random_filename})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
