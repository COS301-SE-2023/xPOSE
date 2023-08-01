import MessageBuilder from './MessageBuilder';

describe('MessageBuilder', () => {
  test('should build a message object with the correct type', () => {
    const messageType = 'text';
    const message = new MessageBuilder().setType(messageType).build();
    expect(message.data.type).toBe(messageType);
  });

  test('should build a message object with the correct message', () => {
    const messageContent = 'Hello, world!';
    const message = new MessageBuilder().setMessage(messageContent).build();
    expect(message.data.message).toBe(messageContent);
  });

  test('should build a message object with the correct senderId', () => {
    const senderId = 'user123';
    const message = new MessageBuilder().setSenderId(senderId).build();
    expect(message.data.senderId).toBe(senderId);
  });

  test('should build a message object with the correct receiverId', () => {
    const receiverId = 'user456';
    const message = new MessageBuilder().setReceiverId(receiverId).build();
    expect(message.data.receiverId).toBe(receiverId);
  });

  test('should build a message object with the correct status', () => {
    const status = 'delivered';
    const message = new MessageBuilder().setStatus(status).build();
    expect(message.data.status).toBe(status);
  });

  test('should build a message object with the current timestamp', () => {
    const currentTime = Date.now();
    const message = new MessageBuilder().build();
    expect(message.data.timestamp).toBeGreaterThanOrEqual(currentTime);
  });
});
