from flask import Flask, request, jsonify
import os
import sys
# face_recognition_functions.py is in /libs/
sys.path.append(os.path.join(os.path.dirname(__file__), 'libs'))
from face_recognition_functions import encode_and_store_face, decode_faces

app = Flask(__name__)

@app.route('/:event_id', methods=['POST'])
def create_post():
    return jsonify({'Message': 'Created a post'}, 201)

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
            user_id = request.form['user_id']
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
    # app.run(debug=True)
    import rabbitmq_functions