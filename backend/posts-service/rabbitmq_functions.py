import pika
import json
from datetime import datetime
import os
import sys
from decouple import config

# Load environment variables using decouple
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

        # Declare the queue as durable
        channel.queue_declare(queue=queue_name, durable=True)

        message_str = json.dumps(message)
        # Set delivery_mode to 2 to make the message persistent
        channel.basic_publish(exchange='',
                              routing_key=queue_name,
                              body=message_str,
                              properties=pika.BasicProperties(
                                  delivery_mode=2,  # Make the message persistent
                              ))

        print(f"[x] Sent {message_str} to the {queue_name} queue")

        connection.close()
    except Exception as e:
        print(f"Error sending message: {str(e)}")

if __name__ == "__main__":
    # Example usage:
    queue_name = 'notifications'
    message = MessageBuilder().set_type("join_event").set_message("the second persistent message ").set_sender_id('5797bde7-dbad-4e2c-a881-140c77d717ac').set_receiver_id('5797bde7-dbad-4e2c-a881-140c77d717ac').set_value({
        "code": '1code244',
        "inviter_id": '5797bde7-dbad-4e2c-a881-140c77d717ac',
        "invitee_id": '5797bde7-dbad-4e2c-a881-140c77d717ac'
    }).build()

    try:
        send_message_to_queue(queue_name, message)
    except Exception as e:
        print(f"Error sending notification: {str(e)}")
