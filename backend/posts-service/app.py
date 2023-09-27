from flask import Flask, request, jsonify
from db_connector import *
from firebase_functions import upload_image_to_firebase, delete_image_from_firebase
from face_recognition_functions import encode_and_store_face, decode_faces, clear_face_encodings
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

            # iterate through detected users and send each one
            # TODO: Add a notification to the notifications queue for each detected user
            # Initialize Firestore client
            firestore_client = firestore.Client()

            timestamp = firestore.SERVER_TIMESTAMP

            # Create a new post document in the Firestore collection
            posts_ref = firestore_client.collection(f'Event-Posts/{event_id}/posts')
            new_post_doc = posts_ref.add({
                'image_url': image_url,
                'uid': user_id,
                'users_in_image': detected_users,
                'timestamp': timestamp
            })

            print(new_post_doc)

            # Retrieve the generated document ID
            # Retrieve the generated document ID from the tuple
            post_doc_ref, post_doc_id = new_post_doc
            print('Post Document ID:', post_doc_id.id)
            print('Post Document Reference:', post_doc_ref)

            # Save the document references inside user in the Users collection
            for detected_user_id in detected_users:
                # Check if the user exists in the Users collection
                detected_user_ref = firestore_client.collection('Users').document(detected_user_id)
                detected_user_doc = detected_user_ref.get()

                if detected_user_doc.exists:
                    # Update the existing document
                    # store post reference in the posts collection inside the user document
                    detected_user_ref.collection('posts').document(post_doc_id.id).set({
                        'event_id': event_id,
                        'image_url': image_url,
                        'uid': user_id,
                        'users_in_image': detected_users,
                        'timestamp': timestamp
                    })

                    # detected_user_ref.update({
                    #     'posts': firestore.ArrayUnion([f'Event-Posts/{event_id}/posts/{post_doc_id}'])
                    # })
                else:
                    # Create a new user document
                    # detected_user_ref.set({
                    #     'posts': firestore.ArrayUnion([new_post_doc[1].id])
                    # })
                    # delete the user from the database
                    # User.delete().where(User.uid == detected_user_id).execute()
                    # return jsonify({'error': 'User not found'}), 400
                    pass

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
        
@app.route('/<event_id>/<post_id>', methods=['DELETE'])
def delete_post(event_id, post_id):
    try:
        # Check if the post exists in the SQL 'posts' table
        try:
            post = Post.get(Post.pid == post_id)
        except Post.DoesNotExist:
            return jsonify({'error': 'Post not found'}), 404

        # Delete the post from the SQL 'posts' table
        post.delete_instance()

        # Initialize Firestore client
        firestore_client = firestore.Client()

        # Check if the post exists in the Firestore collection
        post_ref = firestore_client.collection(f'Event-Posts/{event_id}/posts').document(post_id)
        post_doc = post_ref.get()

        # Delete image from Firebase Storage

        if post_doc.exists:
            # Delete the post from the Firestore collection
            post_ref.delete()

        return jsonify({'message': 'Deleted a post', 'post_id': post_id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/<event_id>/<post_id>/comment', methods=['POST'])
def create_comment(event_id, post_id):
    try:
        # Get user ID and comment message from the request
        user_id = request.form['user_id']
        comment_message = request.form['message']

        # Initialize Firestore client
        firestore_client = firestore.Client()

        # Check if the post exists in the Firestore collection
        post_ref = firestore_client.collection(f'Event-Posts/{event_id}/posts').document(post_id)
        post_doc = post_ref.get()

        if not post_doc.exists:
            return jsonify({'error': 'Post not found'}), 404

        # Create a new comment document inside the post document
        comments_collection = post_ref.collection('comments')
        new_comment_doc = comments_collection.add({
            'uid': user_id,
            'message': comment_message,
            'timestamp': firestore.SERVER_TIMESTAMP
        })

        # Retrieve the generated comment ID
        comment_doc_ref, comment_doc_id = new_comment_doc
        comment_id = comment_doc_id.id

        return jsonify({'message': 'Created a comment', 'comment_id': comment_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/<event_id>/<post_id>/comment/<comment_id>', methods=['GET', 'DELETE'])
def get_and_delete_comment(event_id, post_id, comment_id):
    try:
        # Initialize Firestore client
        firestore_client = firestore.Client()

        # Check if the post exists in the Firestore collection
        post_ref = firestore_client.collection(f'Event-Posts/{event_id}/posts').document(post_id)
        post_doc = post_ref.get()

        if not post_doc.exists:
            return jsonify({'error': 'Post not found'}), 404

        # Check if the comment exists in the comments collection under the post
        comment_ref = post_ref.collection('comments').document(comment_id)
        comment_doc = comment_ref.get()

        if not comment_doc.exists:
            return jsonify({'error': 'Comment not found'}), 404

        if request.method == 'GET':
            # Retrieve the comment details
            comment_data = comment_doc.to_dict()
            return jsonify({'message': 'Retrieved comment details', 'comment_data': comment_data}), 200
        elif request.method == 'DELETE':
            # Delete the comment document
            comment_ref.delete()
            return jsonify({'message': 'Deleted a comment', 'comment_id': comment_id}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/<event_id>/<post_id>/like', methods=['POST'])
def create_like(event_id, post_id):
    try:
        # Get user ID from the request
        user_id = request.form['user_id']

        # Initialize Firestore client
        firestore_client = firestore.Client()

        # Check if the post exists in the Firestore collection
        post_ref = firestore_client.collection(f'Event-Posts/{event_id}/posts').document(post_id)
        post_doc = post_ref.get()

        if not post_doc.exists:
            return jsonify({'error': 'Post not found'}), 404

        # Create a new like document inside the post document
        likes_collection = post_ref.collection('likes')
        new_like_doc = likes_collection.add({
            'uid': user_id,
            'timestamp': firestore.SERVER_TIMESTAMP
        })

        # Retrieve the generated like ID
        like_doc_ref, like_doc_id = new_like_doc
        like_id = like_doc_id.id

        return jsonify({'message': 'Created a like', 'like_id': like_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/<event_id>/<post_id>/like/<like_id>', methods=['DELETE'])
def delete_like(event_id, post_id, like_id):
    try:
        # Initialize Firestore client
        firestore_client = firestore.Client()

        # Check if the post exists in the Firestore collection
        post_ref = firestore_client.collection(f'Event-Posts/{event_id}/posts').document(post_id)
        post_doc = post_ref.get()

        if not post_doc.exists:
            return jsonify({'error': 'Post not found'}), 404

        # Check if the like exists in the likes collection under the post
        like_ref = post_ref.collection('likes').document(like_id)
        like_doc = like_ref.get()

        if not like_doc.exists:
            return jsonify({'error': 'Like not found'}), 404

        # Delete the like document
        like_ref.delete()

        return jsonify({'message': 'Deleted a like', 'like_id': like_id}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/user/<uid>', methods=['GET'])
def get_user_image(uid):
    try:
        # Create a Firestore client
        firestore_client = firestore.Client()

        # Get the user document by UID
        user_ref = firestore_client.collection('Users').document(uid)
        user_data = user_ref.get().to_dict()

        if not user_data:
            return jsonify({'error': 'User not found'}), 404

        # Check if the user document contains an 'image_url' field
        if 'image_url' in user_data:
            image_url = user_data['image_url']
            return jsonify({'image_url': image_url}), 200
        else:
            return jsonify({'error': 'User image not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/register', methods=['POST'])
def register_user():
    if request.method == 'POST':
        try:
            user_id = request.form['user_id']
            image_file = request.files['image']
            
            # Store the user image in Firebase Storage
            image_url = upload_image_to_firebase(image_file)
            print('Image URL: ', image_url) 

            image_file.seek(0)

            # Encode and store the user's face data
            result, status_code = encode_and_store_face(image_file, user_id)
            print('Retrieved result: ', result, ' with status code: ', status_code)

            # Save or update the image URL in Firestore
            firestore_client = firestore.Client()
            user_ref = firestore_client.collection('Users').document(user_id)

            # Check if the document exists in Firestore
            user_data = user_ref.get()
            if user_data.exists:
                # Update the existing document
                user_ref.update({
                    'image_url': image_url
                })
            else:
                return jsonify({'error': 'User does not exist'}), 404
            
            print('User image URL updated in Firestore')

            return jsonify(result), status_code
        except Exception as e:
            return jsonify({'error': str(e)}), 400



@app.route('/user/<uid>/delete', methods=['DELETE'])
def delete_user_image(uid):
    try:
        # Create a Firestore client
        firestore_client = firestore.Client()

        # Get the user document by UID
        user_ref = firestore_client.collection('Users').document(uid)
        user_data = user_ref.get().to_dict()

        if not user_data:
            return jsonify({'error': 'User not found'}), 404
        
        print('User data: ', user_data  )

        # Check if the user document contains an 'image_url' field
        if 'image_url' in user_data:
            image_url = user_data['image_url']
            
            # Delete the image from Firebase Storage
            print('Deleting image from Firebase Storage')
            delete_image_from_firebase(image_url)
            print('Image deleted from Firebase Storage')

            # Remove the image URL from Firestore
            user_ref.update({
                'image_url': firestore.DELETE_FIELD
            })
            
            # Clear face encodings in the MySQL database (You'll need to implement this)
            clear_face_encodings(uid)
            
            return jsonify({'message': 'Deleted user image'}), 200
        else:
            return jsonify({'error': 'User image not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/detect', methods=['POST'])
def detect_users():
    if request.method == 'POST':
        try:
            image_file = request.files['image']
            result, status_code = decode_faces(image_file)
            return jsonify(result), status_code
        except Exception as e:
            return jsonify({'error': str(e)}), 400

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'Message': 'Posts service is healthy'}, 200)

if __name__ == '__main__':
    create_tables()
    app.run(debug=True)
    # import rabbitmq_functions