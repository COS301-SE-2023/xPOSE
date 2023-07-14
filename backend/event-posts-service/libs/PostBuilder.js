class PostBuilder {
    constructor() {
        this.post = {};
    }

    withUid(uid) {
        this.post.uid = uid;
        return this;
    }

    withTimestamp(timestamp) {
        this.post.timestamp = timestamp;
        return this;
    }

    withImage(imageUrl) {
        this.post.image = {
            image_url: imageUrl,
            // data: data,
        };
        return this;
    }

    withComments() {
        this.post.comments = [];
        return this;
    }

    withLikes() {
        this.post.likes = [];
        return this;
    }

    build() {
        return this.post;
    }
}

module.exports = PostBuilder;