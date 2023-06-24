"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const firebase_admin_1 = require("firebase-admin");
const firebase_admin_2 = require("./firebase.admin");
const path = require("path");
let AppService = exports.AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
    async getEvents() {
        const db = firebase_admin_2.admin.firestore();
        const eventsSnapshot = await db.collection('events').get();
        return eventsSnapshot.docs.map((event) => event.data());
    }
    async createEvent(eventDto) {
        const db = firebase_admin_2.admin.firestore();
        const eventRef = await db.collection('events').add(eventDto);
        return eventRef.id;
    }
    async getEventById(eventId) {
        const db = firebase_admin_2.admin.firestore();
        const eventDoc = await db.collection('events').doc(eventId).get();
        if (eventDoc.exists) {
            return eventDoc.data();
        }
        return null;
    }
    async updateEvent(eventId, eventDto) {
        const db = firebase_admin_2.admin.firestore();
        const eventRef = db.collection('events').doc(eventId);
        await eventRef.update(eventDto);
        return true;
    }
    async deleteEvent(eventId) {
        const db = firebase_admin_2.admin.firestore();
        await db.collection('events').doc(eventId).delete();
        return true;
    }
    async uploadImage(file) {
        const bucket = (0, firebase_admin_1.storage)().bucket();
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        const fileOptions = {
            destination: `images/${uniqueFilename}`,
            metadata: {
                contentType: file.mimetype,
            },
        };
        await bucket.upload(file.path, fileOptions);
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileOptions.destination}`;
        return imageUrl;
    }
};
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map