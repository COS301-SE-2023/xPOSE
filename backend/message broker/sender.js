import amqp from 'amqplib/callback_api.js';
import dotenv from 'dotenv';
dotenv.config();

class RabbitMQProducer {
    constructor() {
        this.connection = null;
        this.channel = null;
    }

    connect() {
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

                    // predefined Queues in the message broker
                    let notificationsQueue = 'notificationsQueue';
                    let eventsQueue = 'eventsQueue';
                    let aiRecogQueue = "aiRecogQueue"
                    channel.assertQueue(notificationsQueue, { durable: false });
                    channel.assertQueue(eventsQueue, { durable: false });
                    channel.assertQueue(aiRecogQueue, { durable: false });

                    // create exchange
                    channel.assertExchange('Exchange', 'direct', { durable: true });

                    // bind queue routes to the Exchange
                    channel.bindQueue(notificationsQueue, 'Exchange', 'notifications');
                    channel.bindQueue(eventsQueue, 'Exchange', 'events');
                    channel.bindQueue(aiRecogQueue, 'Exchange', 'ai');

                    resolve();
                });
            });
        });
    }

    sendMessage(queueRoute, message) {
        if (!this.channel) {
            throw new Error('Connection not established. Call connect() first.');
        }

        return new Promise((resolve, reject) => {
          const sent = this.channel.publish('Exchange', queueRoute, Buffer.from(message));
          if(sent) {
            resolve();
          } else {
            reject (new Error("Message could not be sent"));
          }
        });
        
    }

    closeConnection() {
        if (this.connection) {
            setTimeout(() => {
                this.connection.close();
                console.log('Connection closed...');
                process.exit(0);
            }, 500);
        }
    }
}

export default   RabbitMQProducer;


  // Communicate with the notification service
//   (async () => {
//     const producer = new RabbitMQProducer();
//     try {
//         await producer.connect();
//         console.log('communicating with the notificationsQueue');
//         const now = new Date();
//         const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
//         console.log("Friend request sent at "+ timestamp); 
//         let userId ="1234";
//         let requestId ="2233";
//         let response ="pending";
//         let msg = `{
//           notificationType: 'friendRequest',
//           userId: ${userId},
//           requestId: ${requestId},
//           timestamp: ${timestamp},
//           status: ${response}
//         }`;

//         await producer.sendMessage('notifications', msg);
//         // Wait a bit before closing the connection
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         producer.closeConnection();
//     } catch (error) {
//         console.error('Error:', error);
//     }
//   })();


