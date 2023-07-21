import amqp from 'amqplib/callback_api.js';
import dotenv from 'dotenv';
dotenv.config();


export function receiveMessageFromQueue(queue) {
    return new Promise((resolve, reject) => {
        amqp.connect(process.env.CLOUDAMQP_URL, function (error0, connection) {
            if(error0) {
                // throw error0;
                reject(error0);
            }
        
            connection.createChannel(function (error1, channel) {
                if(error1) {
                    throw error1;
                }
        
                // let queue = 'hello';
        
                channel.assertQueue(queue, {
                    durable: false
                });
    
                console.log("Waiting for messages...");
                channel.consume(queue, function (msg) {
                    if (msg !== null){
                        const jsonString = msg.content.toString();
                        const message = JSON.parse(jsonString);
    
                        // console.log(`[x] Received ${jsonString} from ${queue} queue`);
                        // console.log('Parsed Message:', message);
                         
                        resolve(message);
                    }
                }, {
                    noAck: true
                });
            });
        });

    });

}

// const queueName = 'notifications';
// receiveMessageFromQueue(queueName);



