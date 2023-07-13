class CommentBuilder {
    constructor() {
        this.comment = {};
    }
  
    setUid(uid) {
        this.comment.uid = uid;
        return this;
    }
  
    setMessage(message) {
        this.comment.message = message;
        return this;
    }
  
    setTimestamp(timestamp) {
        this.comment.timestamp = timestamp;
        return this;
    }
  
    build() {
        return this.comment;
    }
}