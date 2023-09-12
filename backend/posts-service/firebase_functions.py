import random
import string
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials, storage, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate('./permissions.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'xpose-4f48c.appspot.com',  # Use only the bucket name here
    'databaseURL': 'https://xpose-4f48c-default-rtdb.firebaseio.com'
})

def upload_image_to_firebase(image, filename=None):
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
