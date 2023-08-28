# This should register the face of the user in the database.
# Check if the uploaded image is a proper headshot.
import boto3

s3 = boto3.client('s3')
rekognition = boto3.client('rekognition', region_name='us-east-1')
dynamodbTableName = 'xpose-users'
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
usersTable = dynamodb.Table(dynamodbTableName)

def lambda_handler(event, context):
    print(event)
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key'] # This is the name of the file uploaded to s3
    
    try:
        response = index_user_face(bucket, key)
        print(response)

        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            face_id = response['FaceRecords'][0]['Face']['FaceId']
            user_id = key.split('.')[0]
            register_user_face(user_id, face_id)
            return response
            # print("Face indexed successfully")
        
    except Exception as e:
        print(e)
        print("Error processing object {} from bucket {}. ".format(key, bucket))
        raise e
    
def index_user_face(bucket, key):
    response = rekognition.index_faces(
        CollectionId='xpose-users', # TODO: Create a collection for each user
        Image={
            'S3Object': {
                'Bucket': bucket,
                'Name': key
            }
        },
        # ExternalImageId=key.split('.')[0],
        # DetectionAttributes=['ALL']
    )
    return response

def register_user_face(user_id, face_id):
    usersTable.put_item(
        Item={
            'user_id': user_id,
            'rekognitionId': face_id
        }
    )