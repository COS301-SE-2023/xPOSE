class CommentBuilder {
    constructor() {
        this.comment = {};
    }
  
    withUid(uid) {
        this.comment.uid = uid;
        return this;
    }
  
    withMessage(message) {
        this.comment.message = message;
        return this;
    }
  
    withTimestamp(timestamp) {
        this.comment.timestamp = timestamp;
        return this;
    }
  
    build() {
        return this.comment;
    }
}