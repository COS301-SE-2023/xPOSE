import pika
import json
from datetime import datetime
import os
import sys
# face_recognition_functions.py is in ../data-access/
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'data-access'))
import db_connector
from decouple import config

# Load environment variables using decouple
CLOUDAMQP_CLUSTER = config('CLOUDAMQP_CLUSTER')
CLOUDAMQP_HOST = config('CLOUDAMQP_HOST')
CLOUDAMQP_VHOST = config('CLOUDAMQP_VHOST')
CLOUDAMQP_PASSWORD = config('CLOUDAMQP_PASSWORD')
CLOUDAMQP_PORT = config('CLOUDAMQP_PORT')
CLOUDAMQP_URL = config('CLOUDAMQP_URL')

class MessageBuilder:
    def __init__(self):
        self.message = {
            "data": {
                "type": "",
                "message": "",
                "senderId": "",
                "receiverId": "",
                "timestamp": int(datetime.timestamp(datetime.now())),
                "status": "pending",
                "values": []
            }
        }

    def set_type(self, type):
        self.message["data"]["type"] = type
        return self

    def set_value(self, value):
        self.message["data"]["values"].append(value)
        return self

    def set_message(self, message):
        self.message["data"]["message"] = message
        return self

    def set_sender_id(self, sender_id):
        self.message["data"]["senderId"] = sender_id
        return self

    def set_receiver_id(self, receiver_id):
        self.message["data"]["receiverId"] = receiver_id
        return self

    def set_status(self, status):
        self.message["data"]["status"] = status
        return self

    def build(self):
        return self.message

def send_message_to_queue(queue_name, message):
    try:
        # Use CLOUDAMQP_URL directly from the environment variables
        if not CLOUDAMQP_URL:
            raise ValueError("CLOUDAMQP_URL is not defined in the environment variables")

        connection = pika.BlockingConnection(pika.URLParameters(CLOUDAMQP_URL))
        channel = connection.channel()

        channel.queue_declare(queue=queue_name, durable=False)

        message_str = json.dumps(message)
        # Correct the parameters in channel.basic_publish
        channel.basic_publish(exchange='', routing_key=queue_name, body=message_str)

        print(f"[x] Sent {message_str} to the {queue_name} queue")

        connection.close()
    except Exception as e:
        print(f"Error sending message: {str(e)}")

if __name__ == "__main__":
    # Example usage:
    queue_name = 'notifications'
    message = MessageBuilder().set_type("join_event").set_message("more dirt ").set_sender_id('5797bde7-dbad-4e2c-a881-140c77d717ac').set_receiver_id('5797bde7-dbad-4e2c-a881-140c77d717ac').set_value({
        "code": '1code2',
        "inviter_id": '5797bde7-dbad-4e2c-a881-140c77d717ac',
        "invitee_id": '5797bde7-dbad-4e2c-a881-140c77d717ac'
    }).build()

    try:
        send_message_to_queue(queue_name, message)
    except Exception as e:
        print(f"Error sending notification: {str(e)}")
    pass
