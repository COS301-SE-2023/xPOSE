# Using image recognition, find the user and probably send it using rabbitmq
import boto3
import json

s3 = boto3.client('s3')
rekognition = boto3.client('rekognition', region_name='us-east-1')
dynamodbTableName = 'xpose-users'
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
usersTable = dynamodb.Table(dynamodbTableName)
bucketName = 'xpose-posts'

def lambda_handler(event, context):
    print(event)
    objectKey = event['queryStringParameters']['objectKey']
    image_bytes = s3.get_object(Bucket=bucketName, Key=objectKey)['Body'].read()
    response = rekognition.search_faces_by_image(
        CollectionId='xpose-users',
        Image={
            'Bytes': image_bytes
        },
    )

    for match in response['FaceMatches']:
        print(match['Face']['FaceId'], match['Face']['Confidence'])
        face = usersTable.get_item(
            Key={
                'rekognitionId': match['Face']['FaceId']
            }
        )

        if 'Item' in face:
            print('Person Found: ', face['Item']['user_id'])
        
        return buildResponse(200, face['Item']['user_id'])
    print('No person found')
    return buildResponse(404, 'No person found')

def buildResponse(statusCode, body=None):
    response = {
        'statusCode': statusCode,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*'
        }
    }

    if body is not None:
        response['body'] = json.dumps(body)

    return response