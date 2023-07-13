class PostBuilder {
    constructor() {
        this.post = {};
    }

    setUid(uid) {
        this.post.uid = uid;
        return this;
    }

    setTimestamp(timestamp) {
        this.post.timestamp = timestamp;
        return this;
    }

    setImage(imageUrl, data) {
        this.post.image = {
            image_url: imageUrl,
            // data: data,
        };
        return this;
    }

    setComments(comments) {
        this.post.comments = comments;
        return this;
    }

    setLikes(likes) {
        this.post.likes = likes;
        return this;
    }

    build() {
        return this.post;
    }
}
  