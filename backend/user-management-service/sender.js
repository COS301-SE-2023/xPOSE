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
            let msg = 'Hello world';
    
            channel.assertQueue(queue, {
                durable: false
            });
    
            channel.sendToQueue(queue, Buffer.from(msg));
    
            console.log(`[x] Sent ${msg} to the ${queue} queue`);
        });
        
        setTimeout(function () {
            connection.close();
            console.log('Connection closed...');
            // process.exit(0);
        }, 500);

    });
