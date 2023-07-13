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

    withComments(comments) {
        this.post.comments = comments;
        return this;
    }

    withLikes(likes) {
        this.post.likes = likes;
        return this;
    }

    build() {
        return this.post;
    }
}
  