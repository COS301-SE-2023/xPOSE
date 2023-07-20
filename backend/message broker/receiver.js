const amqp = require('amqplib/callback_api');
require('dotenv').config();

class RabbitMQConsumer {
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

module.exports = RabbitMQConsumer;








// require('dotenv').config();
// let amqp = require('amqplib/callback_api');

// amqp.connect(process.env.CLOUDAMQP_URL, function (error0, connection) {
//     if(error0) {
//         throw error0;
//     }

//     connection.createChannel(function (error1, channel) {
//         if(error1) {
//             throw error1;
//         }

//         let notificationQuue = 'Notifications_service';

//         // Assert the exchange
//         channel.assertExchange("Exchange", 'direct', { durable: true });
//         channel.assertQueue(notificationQuue, {durable:false});
//         // Bind the queue to the exchange with the specified routing key
//       channel.bindQueue(notificationQuue, "Exchange", "notifications");
//         // Consumes messages
//         console.log("Waiting for messages... to exit press CTRL+C ", notificationQuue);
//         channel.consume(notificationQuue, function (msg) {
//             console.log(msg.content.toString());
//             // console.log(msg);
//             // console.log(`[x] Received ${msg['content'].toString()} from ${queue} queue`);
//         }, {
//             noAck: true
//         });
//     });
// });


