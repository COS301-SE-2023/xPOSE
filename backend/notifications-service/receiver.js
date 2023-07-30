import amqp from 'amqplib/callback_api.js';
import dotenv from 'dotenv';
dotenv.config();

let isProcessing = false; // Flag to track if the function is currently processing a message

export function receiveMessageFromQueue(queue) {
    // If already processing, return a Promise that resolves with null
    if (isProcessing) {
        return Promise.resolve(null);
    }

    isProcessing = true; // Set the flag to indicate that processing is ongoing

    return new Promise((resolve, reject) => {
        amqp.connect(process.env.CLOUDAMQP_URL, function (error0, connection) {
            if(error0) {
                // throw error0;
                isProcessing = false; // Reset the flag in case of an error
                reject(error0);
                return;
            }
        
            connection.createChannel(function (error1, channel) {
                if(error1) {
                    // throw error1;
                    isProcessing = false; // Reset the flag in case of an error
                    reject(error1);
                    return;
                }

                channel.assertQueue(queue, {
                    durable: false
                });
    
                // console.log("Waiting for messages...");
                channel.consume(queue, function (msg) {
                    if (msg !== null) {
                        const jsonString = msg.content.toString();
                        const message = JSON.parse(jsonString);
    
                        // console.log(`[x] Received ${jsonString} from ${queue} queue`);
                        // console.log('Parsed Message:', message);
                        resolve(message);

                          // Close the channel after receiving and processing the message
                        channel.close((error) => {
                        if (error) {
                            console.error("Error closing the channel:", error);
                        } else {
                            console.log("Channel closed.");
                        }
                        
                        // Close the connection after closing the channel
                        connection.close((connError) => {
                            if (connError) {
                              console.error("Error closing the connection:", connError);
                            } else {
                              console.log("Connection closed.");
                            }

                            isProcessing = false; // Reset the flag after everything
                          });
                        });
                      } else {
                        resolve(null);
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



