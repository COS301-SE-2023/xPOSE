const amqp = require('amqplib/callback_api');
require('dotenv').config();

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

module.exports = RabbitMQProducer;








// const amqp = require('amqplib/callback_api');
// require('dotenv').config();

// amqp.connect(process.env.CLOUDAMQP_URL, function (error0, connection) {
//     if(error0) {
//         throw error0;
//     }

//     connection.createChannel(function (error1, channel) {
//         if(error1) {
//             throw error1;
//         }

//         // Queues in the message broker
//         let notificationQuue = 'Notifications_service';
//         let eventsServiceQueue = "Events_service";
//         channel.assertQueue(notificationQuue, {durable: false});
//         channel.assertQueue(eventsServiceQueue, {durable: false});
//         let msg = "{notificationType: 'friendRequest', userId: 'XXT', timestamp: '<timestamp idk>'}";

//         // create exchange
//         channel.assertExchange('Exchange', 'direct', {durable: true});
        
//         // bind queu routes to the Exchange
//         channel.bindQueue(notificationQuue, 'Exchange', 'notifications');
//         channel.bindQueue(eventsServiceQueue, 'Exchange', 'events');

//         console.log("Sending message...");
//         // channel.sendToQueue(notificationQuue, Buffer.from(msg));
        
//         // Test sending friend request
//         channel.publish(
//             'Exchange',
//             'notifications',
//             Buffer.from(msg)
//         );

//         // console.log(`[x] Sent ${msg} to the ${queue} queue`);
//     });
    
//     setTimeout(function () {
//         connection.close();
//         console.log('Connection closed...');
//         process.exit(0);
//     }, 1000);

// });