class MessageBuilder {
    constructor() {
      this.message = {
        data: {
          type: "",
          message: "",
          senderId: "",
          receiverId: "",
          timestamp: Date.now(),
          status: "pending",
        },
      };
    }
  
    setType(type) {
      this.message.data.type = type;
      return this;
    }
  
    setMessage(message) {
      this.message.data.message = message;
      return this;
    }
  
    setSenderId(senderId) {
      this.message.data.senderId = senderId;
      return this;
    }
  
    setReceiverId(receiverId) {
      this.message.data.receiverId = receiverId;
      return this;
    }
  
    setStatus(status) {
      this.message.data.status = status;
      return this;
    }
  
    build() {
      return this.message;
    }
  }

  export default MessageBuilder;