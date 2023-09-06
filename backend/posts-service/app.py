from flask import Flask, request, jsonify

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
    return jsonify({'Message': 'Registered a user'}, 201)


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'Message': 'Posts service is healthy'}, 200)

if __name__ == '__main__':
    app.run(debug=True)