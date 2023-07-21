import amqp from 'amqplib/callback_api.js';
import dotenv from 'dotenv';
dotenv.config();

amqp.connect(process.env.CLOUDAMQP_URL, function (error0, connection) {
    if(error0) {
        throw error0;
    }

    connection.createChannel(function (error1, channel) {
        if(error1) {
            throw error1;
        }

        let queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        channel.consume(queue, function (msg) {
            console.log(msg);
            console.log(`[x] Received ${msg['content'].toString()} from ${queue} queue`);
        }, {
            noAck: true
        });
    });
});


