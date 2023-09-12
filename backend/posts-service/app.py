# Include external libraries
# import os
# import sys
# sys.path.append(os.path.join(os.path.dirname(__file__), 'libs'))
# sys.path.append(os.path.join(os.path.dirname(__file__), 'data-access'))

from flask import Flask, request, jsonify
from db_connector import *
from firebase_functions import upload_image_to_firebase
# face_recognition_functions.py is in /libs/
from face_recognition_functions import encode_and_store_face, decode_faces
from google.cloud import firestore

import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./permissions.json"


app = Flask(__name__)

@app.route('/<event_id>', methods=['POST'])
def create_post(event_id):
    if request.method == 'POST':
        try:
            # Get user ID and image file from the request
            user_id = request.form['user_id']
            image_file = request.files['image']

            # Check if the event exists in the Event table
            try:
                event = Event.get(Event.eid == event_id)
            except Event.DoesNotExist:
                # Event does not exist, create a new entry
                event = Event.create(eid=event_id, is_encrypted=False, key=None)
                # Check if event is in firestore in the Events collection
                # TODO: In the event service, create an events collection
                # firestore_client = firestore.Client()
                # event_ref = firestore_client.collection('Events-Posts').document(event_id)
                # event_doc = event_ref.get()
                # if event_doc.exists:
                #     # Event exists, create a new entry
                #     event = Event.create(eid=event_id, is_encrypted=False, key=None)
                # else:
                #     return jsonify({'error': 'Event not found'}), 400

            # Check if the user exists in the User table
            try:
                user = User.get(User.uid == user_id)
            except User.DoesNotExist:
                # return jsonify({'error': 'User not found'}), 400
                # check if user is in firestore in the Users collection
                firestore_client = firestore.Client()
                user_ref = firestore_client.collection('Users').document(user_id)
                user_doc = user_ref.get()
                if user_doc.exists:
                    # User exists, create a new entry
                    user = User.create(uid=user_id, face_encoding=None)
                else:
                    return jsonify({'error': 'User not found'}), 400

            print('user_id', user_id)
            print('image_file', image_file.filename)

            # Remove metadata from the image (if needed)
            # Uncomment the line below if you want to remove metadata
            # remove_metadata(image_file)

            # Upload the image to Firebase Storage and get the image URL
            image_url = upload_image_to_firebase(image_file)
            print(image_url)

            # Perform facial recognition to identify users in the image
            result, status_code = decode_faces(image_file)
            detected_users = result.get('detected_users', [])
            print('Detected ', detected_users)

            # Initialize Firestore client
            firestore_client = firestore.Client()

            # Create a new post document in the Firestore collection
            posts_ref = firestore_client.collection(f'Event-Posts/{event_id}/posts')
            new_post_doc = posts_ref.add({
                'image_url': image_url,
                'uid': user_id,
                'detected_users': detected_users,
                'timestamp': firestore.SERVER_TIMESTAMP
            })

            print(new_post_doc)

            # Retrieve the generated document ID
            # Retrieve the generated document ID from the tuple
            post_doc_ref, post_doc_id = new_post_doc
            print('Post Document ID:', post_doc_id.id)
            print('Post Document Reference:', post_doc_ref)

            post_id = post_doc_id.id


            # Create a new post entry in the SQL 'posts' table
            new_post = Post.create(
                pid=post_id,
                image_url=image_url,
                event_eid=event_id,
                post_owner_uid=user_id
            )

            # Add detected users to the PostTaggedUser table
            for detected_user_id in detected_users:
                PostTaggedUser.create(
                    uid=detected_user_id,
                    post_id=post_id
                )

            return jsonify({'message': 'Created a post', 'post_id': post_id}), 201

        except Exception as e:
            return jsonify({'error': str(e)}), 400
        
@app.route('/:event_id/:post_id', methods=['DELETE'])
def delete_post():
    return jsonify({'Message': 'Deleted a post'}, 200)

@app.route('/:event_id/:post_id/comment', methods=['POST'])
def create_comment():
    return jsonify({'Message': 'Created a comment'}, 201)

@app.route('/:event_id/:post_id/comment/:comment_id', methods=['DELETE'])
def delete_comment():
    return jsonify({'Message': 'Deleted a comment'}, 200)

@app.route('/:event_id/:post_id/like', methods=['POST'])
def create_like():
    return jsonify({'Message': 'Created a like'}, 201)

@app.route('/:event_id/:post_id/like/:like_id', methods=['DELETE'])
def delete_like():
    return jsonify({'Message': 'Deleted a like'}, 200)

@app.route('/register', methods=['POST'])
def register_user():
    if request.method == 'POST':
        try:
            user_id = request.form['uid']
            image_file = request.files['image']
            result, status_code = encode_and_store_face(image_file, user_id)
            return jsonify(result), status_code
        except Exception as e:
            return jsonify({'error': str(e)}), 400

@app.route('/detect', methods=['POST'])
def detect_users():
    if request.method == 'POST':
        try:
            image_file = request.files['image']
            result, status_code = decode_faces(image_file)
            return jsonify(result), status_code
        except Exception as e:
            return jsonify({'error': str(e)}), 400


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'Message': 'Posts service is healthy'}, 200)

if __name__ == '__main__':
    create_tables()
    app.run(debug=True)
    # import rabbitmq_functions