import json
import numpy as np
# import PIL.Image as PILImage
import face_recognition
import os
import sys
from db_connector import User
from PIL import Image, ExifTags

def preprocess_image(image_file):
    original_image = Image.open(image_file)
    
    # Rotate the image based on EXIF orientation data
    for orientation in ExifTags.TAGS.keys():
        if ExifTags.TAGS[orientation] == 'Orientation':
            break
    try:
        exif = dict(original_image._getexif().items())
        if exif[orientation] == 3:
            original_image = original_image.rotate(180, expand=True)
        elif exif[orientation] == 6:
            original_image = original_image.rotate(270, expand=True)
        elif exif[orientation] == 8:
            original_image = original_image.rotate(90, expand=True)
    except (AttributeError, KeyError, IndexError):
        # No EXIF data found, or orientation tag is missing
        pass
    
    # Calculate new dimensions
    width, height = original_image.size
    new_width = int(width * 0.3)  # 70% reduction in width
    new_height = int(height * 0.3)  # 70% reduction in height
    
    # Resize the image with ANTIALIAS filter
    resized_image = original_image.resize((new_width, new_height))
    
    # Set resolution to 72 dpi
    resized_image.info['dpi'] = (72, 72)
    
    return resized_image

def encode_and_store_face(image_file, user_id):
    try:
        # Preprocess the image
        resized_image = preprocess_image(image_file)
        
        if resized_image is None:
            return {'error': 'Error during image preprocessing'}, 400

        # Convert the image to a numpy array
        image_array = np.array(resized_image)

        # Perform face detection on the image
        face_encodings = face_recognition.face_encodings(image_array)

        if len(face_encodings) == 0:
            return {'error': 'No faces were detected in the provided image'}, 400

        encoding = face_encodings[0]  # Assuming there's at least one face

        # Serialize the encoding array to a JSON string
        encoding_json = json.dumps(encoding.tolist())

        # Check if the user already exists in the database
        existing_user = User.get_or_none(User.uid == user_id)

        if existing_user:
            # Update the face encoding for the existing user
            existing_user.face_encoding = encoding_json
            existing_user.save()
            print("Face encoding updated for the existing user")
        else:
            # Create a new user and save their encoding in the database
            new_user = User.create(uid=user_id, face_encoding=encoding_json)
            print("User created and face encoding saved in the database successfully")

        return {'message': 'User face encoding saved successfully'}, 200
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

def clear_face_encodings(user_id):
    try:
        # Check if the user exists in the database
        user = User.get_or_none(User.uid == user_id)

        if user:
            # Clear the face encoding for the user
            user.face_encoding = None
            user.save()
            return {'message': 'Face encodings cleared successfully'}, 200
        else:
            return {'error': 'User not found'}, 404
    except Exception as e:
        return {'error': str(e)}, 400