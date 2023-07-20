import amqp from 'amqplib/callback_api.js';
import dotenv from 'dotenv';
dotenv.config();

export default class RabbitMQConsumer {
    constructor(queueName) {
        this.queueName = queueName;
        this.connection = null;
        this.channel = null;
        console.log("RabbitMQ constructor");
    }

    async connect() {
        return new Promise((resolve, reject) => {
            amqp.connect(process.env.CLOUDAMQP_URL, (error0, connection) => {
                if (error0) {
                    reject(error0);
                    return;
                }

                this.connection = connection;
                connection.createChannel((error1, channel) => {
                    if (error1) {
                        reject(error1);
                        return;
                    }

                    this.channel = channel;
                    channel.assertQueue(this.queueName, { durable: false });

                    resolve();
                });
            });
        });
    }

    consume(callback) {
        if (!this.channel) {
            throw new Error('Connection not established. Call connect() first.');
        }

        this.channel.consume(this.queueName, (msg) => {
            if (msg !== null) {
                const content = msg.content.toString();
                callback(content);
                this.channel.ack(msg);
            }
        });
    }

    closeConnection() {
        if (this.connection) {
            this.connection.close();
            console.log('Connection closed...');
        }
    }
}


/*(async () => {
      const consumer = new RabbitMQConsumer('notificationsQueue');
      try {
          await consumer.connect();
          console.log('Notification service Waiting for messages...');
    
          consumer.consume((message) => {
              console.log('Received message:', message);
              // Add your logic to process the message here
          });
    
          // Keep the consumer running indefinitely, or you can set a timeout to close the connection.
      } catch (error) {
          console.error('Error:', error);
      }
    })();*/








