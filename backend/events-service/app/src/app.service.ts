// app.service.ts
import { Injectable } from '@nestjs/common';
import { storage } from 'firebase-admin';
import { admin } from './firebase.admin';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import * as path from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getEvents(): Promise<Event[]> {
    const db = admin.firestore();
    const eventsSnapshot = await db.collection('events').get();
    return eventsSnapshot.docs.map((event) => event.data() as Event);
  }

  async createEvent(eventDto: CreateEventDto): Promise<string> {
    const db = admin.firestore();
    const eventRef = await db.collection('events').add(eventDto);
    return eventRef.id;
  }

  async getEventById(eventId: string): Promise<Event | null> {
    const db = admin.firestore();
    const eventDoc = await db.collection('events').doc(eventId).get();
    if (eventDoc.exists) {
      return eventDoc.data() as Event;
    }
    return null;
  }

  async updateEvent(eventId: string, eventDto: UpdateEventDto): Promise<boolean> {
    const db = admin.firestore();
    const eventRef = db.collection('events').doc(eventId);
    await eventRef.update(eventDto);
    return true;
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    const db = admin.firestore();
    await db.collection('events').doc(eventId).delete();
    return true;
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const bucket = storage().bucket();

    // Generate a unique filename
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
  
    // Upload the file to Firebase Storage
    const fileOptions = {
      destination: `images/${uniqueFilename}`,
      metadata: {
        contentType: file.mimetype,
      },
    };
  
    await bucket.upload(file.path, fileOptions);
  
    // Get the download URL of the uploaded file
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileOptions.destination}`;
  
    return imageUrl;
  }
}
