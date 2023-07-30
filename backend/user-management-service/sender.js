import amqp from 'amqplib/callback_api.js';
import dotenv from 'dotenv';
import MessageBuilder from './controllers/messagebuilder.js';

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
 


// const queueName = 'notifications';

// const message = new MessageBuilder()
// .setType("friend_request")
// .setMessage("Friend request from John Doe")
// .setSenderId("1818")
// .setReceiverId("1212")
// .build();
// sendMessageToQueue(queueName, message);
