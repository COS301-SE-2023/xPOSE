class UserBuilder {
    constructor() {
      this.userData = {};
    }
  
    withUid(uid) {
      this.userData.uid = uid;
      return this;
    }
  
    build() {
      return this.userData;
    }
}

