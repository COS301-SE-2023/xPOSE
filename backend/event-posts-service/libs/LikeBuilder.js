class LikeBuilder {
    constructor() {
        this.like = {};
    }

    setUid(uid) {
        this.like.uid = uid;
        return this;
    }

    setTimestamp(timestamp) {
        this.like.timestamp = timestamp;
        return this;
    }

    build() {
        return this.like;
    }
}