const amqp = require('amqplib/callback_api');
require('dotenv').config();

amqp.connect(process.env.CLOUDAMQP_URL, function (error0, connection) {
    if(error0) {
        throw error0;
    }

    connection.createChannel(function (error1, channel) {
        if(error1) {
            throw error1;
        }

        // Queues in the message broker
        let notificationQuue = 'Notifications_service';
        let eventsServiceQueue = "Events_service";
        channel.assertQueue(notificationQuue, {durable: false});
        channel.assertQueue(eventsServiceQueue, {durable: false});
        let msg = "{notificationType: 'friendRequest', userId: 'XXT', timestamp: '<timestamp idk>'}";

        // create exchange
        channel.assertExchange('Exchange', 'direct', {durable: true});
        
        // bind queu routes to the Exchange
        channel.bindQueue(notificationQuue, 'Exchange', 'notifications');
        channel.bindQueue(eventsServiceQueue, 'Exchange', 'events');

        console.log("Sending message...");
        // channel.sendToQueue(notificationQuue, Buffer.from(msg));
        
        // Test sending friend request
        channel.publish(
            'Exchange',
            'notifications',
            Buffer.from(msg)
        );

        // console.log(`[x] Sent ${msg} to the ${queue} queue`);
    });
    
    setTimeout(function () {
        connection.close();
        console.log('Connection closed...');
        process.exit(0);
    }, 1000);

});