// import RabbitMQConsumer from "../message broker/receiver.js";

// (async () => {
//       const consumer = new RabbitMQConsumer('notificationsQueue');
//       try {
//           await consumer.connect();
//           console.log('Notification service Waiting for messages...');
    
//           consumer.consume((message) => {
//               console.log('Received message:', message);
//               // Add your logic to process the message here
//           });
    
//           // Keep the consumer running indefinitely, or you can set a timeout to close the connection.
//       } catch (error) {
//           console.error('Error:', error);
//       }
//     })();