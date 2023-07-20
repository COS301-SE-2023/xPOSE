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
                    let notificationQueue = 'Notifications_service';
                    let eventsServiceQueue = 'Events_service';
                    let aiRecServiceQueue = "AI_service"
                    channel.assertQueue(notificationQueue, { durable: false });
                    channel.assertQueue(eventsServiceQueue, { durable: false });

                    // create exchange
                    channel.assertExchange('Exchange', 'direct', { durable: true });

                    // bind queue routes to the Exchange
                    channel.bindQueue(notificationQueue, 'Exchange', 'notifications');
                    channel.bindQueue(eventsServiceQueue, 'Exchange', 'events');
                    channel.bindQueue(eventsServiceQueue, 'Exchange', 'ai');

                    resolve();
                });
            });
        });
    }

    sendMessage(queue, message) {
        if (!this.channel) {
            throw new Error('Connection not established. Call connect() first.');
        }

        this.channel.publish('Exchange', queue, Buffer.from(message));
    }

    closeConnection() {
        if (this.connection) {
            setTimeout(() => {
                this.connection.close();
                console.log('Connection closed...');
                process.exit(0);
            }, 1000);
        }
    }
}

// Example usage
(async () => {
    const producer = new RabbitMQProducer();
    try {
        await producer.connect();
        console.log('Sending message...');
        let msg = "{notificationType: 'friendRequest', userId: 'XXT', timestamp: '<timestamp idk>'}";
        producer.sendMessage('notifications', msg);
        // Wait a bit before closing the connection
        await new Promise(resolve => setTimeout(resolve, 2000));
        producer.closeConnection();
    } catch (error) {
        console.error('Error:', error);
    }
})();









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