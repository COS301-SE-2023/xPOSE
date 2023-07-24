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
        }, 1000);

    });
}
 
const queueName = 'notifications';
const message = {
    data: {
        message: ' you have a new friend request',
        senderId: '1234',
        receiverId: '999',
        timestamp: Date.now(),
        status:"pending"
    }
};
sendMessageToQueue(queueName, message);


