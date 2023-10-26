from peewee import Model, MySQLDatabase, CharField, ForeignKeyField, AutoField, TextField, BooleanField
from decouple import config

# Read database credentials from the .env file
DB_NAME = config('DB_NAME')
DB_USER = config('DB_USER')
DB_PASSWORD = config('DB_PASSWORD')
DB_HOST = config('DB_HOST')

# Create a MySQL database instance
db = MySQLDatabase(DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST)

class BaseModel(Model):
    class Meta:
        database = db

class User(BaseModel):
    uid = CharField(primary_key=True)
    face_encoding = TextField(null=True)

class Event(BaseModel):
    eid = CharField(primary_key=True)
    is_encrypted = BooleanField()
    key = CharField(null=True)

class Post(BaseModel):
    pid = CharField(primary_key=True)
    image_url = TextField()
    event_eid = ForeignKeyField(Event, backref='posts', on_delete='CASCADE')
    post_owner_uid = ForeignKeyField(User, backref='posts', on_delete='CASCADE')

class PostTaggedUser(BaseModel):
    id = AutoField(primary_key=True)
    uid = ForeignKeyField(User, on_delete='CASCADE')
    post_id = ForeignKeyField(Post, on_delete='CASCADE')

class Collections(BaseModel):
    collection_id = AutoField(primary_key=True)
    collection_name = CharField()
    is_private = BooleanField()
    user_uid = ForeignKeyField(User, backref='collections', on_delete='CASCADE')

class PostsCollection(BaseModel):
    id = AutoField(primary_key=True)
    collection_id = ForeignKeyField(Collections, on_delete='CASCADE')
    post_id = ForeignKeyField(Post, on_delete='CASCADE')

def create_tables():
    db.connect()
    db.create_tables([User, Event, Post, PostTaggedUser, Collections, PostsCollection])

def close_connection():
    db.close()
