import { expect } from 'chai';
import MessageBuilder from '../controllers/messagebuilder.js'; // Modify the path as per your project structure

describe('MessageBuilder', () => {
  let messageBuilder;

  beforeEach(() => {
    messageBuilder = new MessageBuilder();
  });

  it('should initialize with default values', () => {
    const message = messageBuilder.build();

    expect(message.data.type).to.equal('');
    expect(message.data.message).to.equal('');
    expect(message.data.senderId).to.equal('');
    expect(message.data.receiverId).to.equal('');
    expect(message.data.status).to.equal('pending');
    expect(message.data.values).to.be.an('array').that.is.empty;
  });

  it('should set message type', () => {
    messageBuilder.setType('text');
    const message = messageBuilder.build();

    expect(message.data.type).to.equal('text');
  });

  it('should add value to values array', () => {
    messageBuilder.setValue('some value');
    const message = messageBuilder.build();

    expect(message.data.values).to.deep.equal(['some value']);
  });

  it('should set message content', () => {
    messageBuilder.setMessage('Hello!');
    const message = messageBuilder.build();

    expect(message.data.message).to.equal('Hello!');
  });

  it('should set senderId', () => {
    messageBuilder.setSenderId('sender123');
    const message = messageBuilder.build();

    expect(message.data.senderId).to.equal('sender123');
  });

  it('should set receiverId', () => {
    messageBuilder.setReceiverId('receiver456');
    const message = messageBuilder.build();

    expect(message.data.receiverId).to.equal('receiver456');
  });

  it('should set message status', () => {
    messageBuilder.setStatus('delivered');
    const message = messageBuilder.build();

    expect(message.data.status).to.equal('delivered');
  });
});
