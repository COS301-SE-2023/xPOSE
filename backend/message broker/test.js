const RabbitMQService = require('./send');

const exchangeName = 'Exchange';
const routingKey = 'notifications';
const message = "{notificationType: 'friendRequest', userId: 'XXT', timestamp: '<timestamp idk>'}";

// wait for each function to complete its operation before
(async () => {
    let rabbitService = new RabbitMQService();
    await rabbitService.connect();
    await rabbitService.createQueue("notification_service", "notifications");
    await rabbitService.publishMessage(exchangeName, routingKey, message);
    await rabbitService.closeConnection();

})();