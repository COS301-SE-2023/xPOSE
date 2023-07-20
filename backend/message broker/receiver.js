require('dotenv').config();
let amqp = require('amqplib/callback_api');

amqp.connect(process.env.CLOUDAMQP_URL, function (error0, connection) {
    if(error0) {
        throw error0;
    }

    connection.createChannel(function (error1, channel) {
        if(error1) {
            throw error1;
        }

        let notificationQuue = 'Notifications_service';

        // Assert the exchange
        channel.assertExchange("Exchange", 'direct', { durable: true });
        channel.assertQueue(notificationQuue, {durable:false});
        // Bind the queue to the exchange with the specified routing key
      channel.bindQueue(notificationQuue, "Exchange", "notifications");
        // Consumes messages
        console.log("Waiting for messages... to exit press CTRL+C ", notificationQuue);
        channel.consume(notificationQuue, function (msg) {
            console.log(msg.content.toString());
            // console.log(msg);
            // console.log(`[x] Received ${msg['content'].toString()} from ${queue} queue`);
        }, {
            noAck: true
        });
    });
});


