class LikeBuilder {
    constructor() {
        this.like = {};
    }

    withUid(uid) {
        this.like.uid = uid;
        return this;
    }

    withTimestamp(timestamp) {
        this.like.timestamp = timestamp;
        return this;
    }

    build() {
        return this.like;
    }
}

module.exports = LikeBuilder;