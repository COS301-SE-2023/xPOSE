import amqp from 'amqplib/callback_api.js';
import dotenv from 'dotenv';
dotenv.config();
   
export function sendMessageToQueue(queue, msg) {
    const jsonString = JSON.stringify(msg);
    amqp.connect(process.env.CLOUDAMQP_URL, function (error0, connection) {
        if(error0) {
            throw error0;
        }
    
        connection.createChannel(function (error1, channel) {
            if(error1) {
                throw error1;
            }
    
            // let queue = 'hello';
            // let msg = 'Hello world';
    
            channel.assertQueue(queue, {
                durable: false
            });
    
            channel.sendToQueue(queue, Buffer.from(jsonString));
    
            console.log(`[x] Sent ${jsonString} to the ${queue} queue`);
        });
        
        setTimeout(function () {
            connection.close();
            console.log('Connection closed...');
            // process.exit(0);
        }, 500);

    });
}
 
// const queueName = 'notifications';
// const message = {
//     from: 'user_service',
//     type: 'friend_request',
//     data: {
//         message: ' you have a new friend request',
//         userId: '12345222',
//         requestId: '4343',
//         timestamp: Date.now()
//     },
//     responses: ['accepted', 'rejected']
// };
// sendMessageToQueue(queueName, message);


