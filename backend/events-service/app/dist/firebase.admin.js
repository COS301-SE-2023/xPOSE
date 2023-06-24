"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = void 0;
const admin = require("firebase-admin");
exports.admin = admin;
const serviceAccount = require('../../permissions.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://xpose-4f48c-default-rtdb.firebaseio.com"
});
//# sourceMappingURL=firebase.admin.js.map