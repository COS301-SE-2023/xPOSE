import json
import numpy as np
import PIL.Image as PILImage
import face_recognition
import os
import sys
from db_connector import User

def encode_and_store_face(image_file, user_id):
    try:
        # Load the image
        image = PILImage.open(image_file)
        print("Image loaded successfully")

        # Convert the image to a numpy array
        image_array = np.array(image)
        print("Image converted to a numpy array successfully")

        # Perform face detection on the image
        face_encodings = face_recognition.face_encodings(image_array)

        if len(face_encodings) == 0:
            return {'error': 'No faces were detected in the provided image'}, 400

        encoding = face_encodings[0]  # Assuming there's at least one face
        print("Face detected and encoded successfully")

        # Serialize the encoding array to a JSON string
        encoding_json = json.dumps(encoding.tolist())
        print("Encoding converted to JSON successfully")

        # Create a new user and save their encoding in the database
        new_user = User.create(uid=user_id, face_encoding=encoding_json)
        print("User created and face encoding saved in the database successfully")

        return {'message': 'User registered successfully'}, 200
    except Exception as e:
        print("Error:", str(e))
        return {'error': str(e)}, 400

def decode_faces(image):
    try:
        image = face_recognition.load_image_file(image)
        face_locations = face_recognition.face_locations(image)
        face_encodings = face_recognition.face_encodings(image, face_locations)

        detected_users = []

        # Retrieve all users from the database
        all_users = User.select().where(User.face_encoding.is_null(False))

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

        return {'detected_users': detected_users}, 200
    except Exception as e:
        return {'error': str(e)}, 400
