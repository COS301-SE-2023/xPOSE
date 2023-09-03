from peewee import Model, MySQLDatabase, CharField, ForeignKeyField, AutoField, TextField
from decouple import config  # Import config from python-decouple

# Read database credentials from the .env file
DB_NAME = config('DB_NAME')
DB_USER = config('DB_USER')
DB_PASSWORD = config('DB_PASSWORD')
DB_HOST = config('DB_HOST')

# Create a MySQL database instance
db = MySQLDatabase(DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST)

# Replace with your MySQL database credentials
db = MySQLDatabase('xpose-posts-database', user='mkhoza', password='{ZgQ?q3MP1sdyX**', host='34.133.32.236')
# ZgQ?q3MP1sdyX**@34.133.32.236
class BaseModel(Model):
    class Meta:
        database = db

class User(BaseModel):
    uid = CharField(primary_key=True)
    face_encoding = CharField()

class Image(BaseModel):
    id = AutoField(primary_key=True)
    url = TextField()
    owner_uid = ForeignKeyField(User, backref='images')

class Event(BaseModel):
    eid = CharField(primary_key=True)
    rules = CharField()

class EventPost(BaseModel):
    pid = CharField(primary_key=True)
    event_id = ForeignKeyField(Event, backref='posts')
    poster_id = ForeignKeyField(User, backref='posts')
    image_id = ForeignKeyField(Image, backref='posts')

class PostComment(BaseModel):
    cid = CharField(primary_key=True)
    post_id = CharField()
    comment = TextField()
    commenter_uid = CharField()

class PostLike(BaseModel):
    id = AutoField(primary_key=True)
    post_id = CharField()
    liker_uid = CharField()

def create_tables():
    db.connect()
    db.create_tables([User, Image, Event, EventPost, PostComment, PostLike])

def close_connection():
    db.close()
