from flask import Flask, request, jsonify
import face_recognition
import numpy as np

app = Flask(__name__)

# Store user encodings in a dictionary for now (replace with a database later)
user_encodings = {}

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

if __name__ == '__main__':
    app.run(debug=True)
