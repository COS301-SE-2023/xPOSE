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

def generate_event_post_form(event_id):
    return f'''
    <form method="post" action="/post/{event_id}" enctype="multipart/form-data">
        <label for="uid">User ID:</label><br>
        <input type="text" id="uid" name="uid" required><br><br>
        <label for="image">Image:</label><br>
        <input type="file" name="image" accept=".jpg, .jpeg, .png" required><br><br>
        <input type="submit" value="Create Event Post">
    </form>
    '''
def generate_image_upload_form():
    form = """
    <form method="POST" action="/upload_image" enctype="multipart/form-data">
        <input type="file" name="image" accept="image/*" required>
        <input type="submit" value="Upload Image">
    </form>
    """
    return form


