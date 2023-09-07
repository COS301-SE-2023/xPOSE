from form_generators import generate_registration_form, generate_detection_form, generate_upload_form, generate_event_post_form, generate_image_upload_form
from datetime import timedelta
import datetime
from flask import Flask, request, jsonify
import face_recognition
import numpy as np
import firebase_admin
from firebase_admin import credentials, storage, firestore
import os
import random
import string
import json
from db_connector import User  # Import the database models
from PIL import Image as PILImage
from datetime import datetime, timedelta


app = Flask(__name__)

# Initialize Firebase Admin SDK
cred = credentials.Certificate('./permissions.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'xpose-4f48c',  # Use only the bucket name here
    'databaseURL': 'https://xpose-4f48c-default-rtdb.firebaseio.com'
})



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

def detect_users_in_image(image):
    try:
        image = face_recognition.load_image_file(image)
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
        print("Detected users: ", detected_users)
        return detected_users
    except Exception as e:
        return str(e)

@app.route('/post/<event_id>/<post_id>', methods=['GET', 'DELETE', 'PUT'])
def delete_event_post(event_id, post_id):
    try:
        # Check if the post exists in the Firestore collection 'Event-Posts/event_id/posts'
        firestore_client = firestore.client()
        event_post_ref = firestore_client.document(f'Event-Posts/{event_id}')
        posts_collection = event_post_ref.collection('posts')
        post_doc = posts_collection.document(post_id)
        
        if not post_doc.get().exists:
            return jsonify({'error': 'Post not found'}), 404

        # Delete the post document
        post_doc.delete()

        return jsonify({'message': 'Post deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def remove_metadata(image):
    try:
        # Open the image using Pillow
        img = PILImage.open(image)

        # Remove EXIF data (metadata) from the image
        img_without_metadata = PILImage.new(img.mode, img.size)
        img_without_metadata.putdata(list(img.getdata()))

        # Save the image without metadata
        # remove the debgging line below
        # img_without_metadata.save('test.jpg', format='JPEG')
        img_without_metadata.save(image, format='JPEG')

        return True  # Successfully removed metadata
    except Exception as e:
        return str(e)  # Return the error message if there's an issue


@app.route('/post/<event_id>', methods=['GET', 'POST'])
def create_event_post(event_id):
    if request.method == 'GET':
        return generate_event_post_form(event_id)
    try:
        # Extract uid from form data
        uid = request.form['uid']

        # Check if the request has an image file
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        

        # Get the image file
        
        image = (request.files['image'])
        image_url = upload_image_to_firebase(image)
        users_in_image = detect_users_in_image(image)

        print("Image url: ", image_url)

        # Create a timestamp
        timestamp = datetime.now()

        # Create a new document in the Firestore collection 'Event-Posts/event_id'
        firestore_client = firestore.client()
        event_post_ref = firestore_client.document(f'Event-Posts/{event_id}')
        posts_collection = event_post_ref.collection('posts')
        new_post_doc = posts_collection.add({
            'image_url': image_url,
            'uid': uid,
            'timestamp': timestamp,
            'users_in_image': users_in_image
        })

        # Retrieve the newly created post document
        new_post_data = new_post_doc.get().to_dict()

        # Construct the response object
        postObject = {
            'id': new_post_doc.id,
            'image_url': new_post_data.get('image_url'),
            'uid': new_post_data.get('uid'),
            'timestamp': new_post_data.get('timestamp').isoformat(),
            'users_in_image': new_post_data.get('users_in_image')
        }

        # Convert the postObject to JSON
        post_json = json.dumps(postObject)

        return jsonify({'Message': post_json}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# sanitize the filename string
def secure_filename(filename : str):
    return ''.join(c for c in filename if c.isalnum() or c in ['.', '_'])

def upload_image_to_firebase(image, filename = None):
    # Generate a random filename if no filename is provided
    if filename is None:
        filename = ''.join(random.choices(string.ascii_letters + string.digits, k=16)) + '.jpg'

    # Get a reference to the Firebase Storage bucket
    bucket = storage.bucket()

    # Upload the image to Firebase Storage
    blob = bucket.blob(f'test/{filename}')
    blob.upload_from_file(image)

    # Generate a download URL for the uploaded image with a 30-year expiration
    expiration_time = datetime.utcnow() + timedelta(days=90)
    expiration_seconds = int(expiration_time.timestamp())
    download_url = blob.generate_signed_url(expiration=expiration_seconds)

    return download_url

@app.route('/upload_image', methods=['POST', 'GET'])
def upload_image():
    if request.method == 'GET':
        return generate_image_upload_form()
    
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image part'})

        image = request.files['image']

        if image.filename == '':
            return jsonify({'error': 'No selected image'})

        if image:
            # Get a reference to the Firebase Storage bucket
            bucket = storage.bucket()

            # Upload the image to Firebase Storage
            blob = bucket.blob('test/mito.jpg')
            blob.upload_from_file(image)

            # Generate a download URL for the uploaded image with a 30-year expiration
            expiration_time = datetime.utcnow() + timedelta(days=90)
            expiration_seconds = int(expiration_time.timestamp())
            download_url = blob.generate_signed_url(expiration=expiration_seconds)

            return jsonify({'message': 'Image uploaded successfully', 'image_url': download_url})
    except Exception as e:
        return jsonify({'error': str(e)})

# Add a comment to a post 
@app.route('/:event_id/:post_id/comment', methods=['POST'])
def add_comment():
    """
    Adding a comment is adding a comment document inside the post document's 'comments' collection.
    """
    pass

# Remove a comment from a post
@app.route('/:event_id/:post_id/comment/:comment_id', methods=['DELETE'])
def remove_comment():
    """
    Removing a comment is deleting a comment document from the post document's 'comments' collection.
    """
    pass

# Add a like to a post or remove a like from a post
@app.route('/:event_id/:post_id/like', methods=['POST', 'DELETE'])
def like_action():
    pass

# Delete a post
@app.route('/:event_id/:post_id', methods=['DELETE'])
def delete_post():
    pass

if __name__ == '__main__':
    app.run(debug=True)
