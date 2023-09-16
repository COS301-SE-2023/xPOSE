// import amqp from 'amqplib/callback_api.js';
const amqp = require('amqplib/callback_api.js');
// import dotenv from 'dotenv';
require('dotenv').config();
// dotenv.config();
   
function sendMessageToQueue(queue, msg) {
    const jsonString = JSON.stringify(msg);
    amqp.connect(process.env.CLOUDAMQP_URL, function (error0, connection) {
        if(error0) {
            throw error0;
        }
    
        connection.createChannel(function (error1, channel) {
            if(error1) {
                throw error1;
            }
    
            channel.assertQueue(queue, {
                durable: true
            });
    
            channel.sendToQueue(queue, Buffer.from(jsonString));
    
            console.log(`[x] Sent ${jsonString} to the ${queue} queue`);
        });
        
        setTimeout(function () {
            connection.close();
            console.log('Connection closed...');
            // process.exit(0);
        }, 1000);

    });
}
 
module.exports = { sendMessageToQueue };

// const queueName = 'notifications';
// const message = {
//     from: 'user_service',
//     type: 'friend_request',
//     data: {
//         message: ' you have a new friend request',
//         senderId: '4444',
//         receiverId: '4343',
//         timestamp: Date.now()
//     },
//     responses: ['accepted', 'rejected']
// };
// sendMessageToQueue(queueName, message);


