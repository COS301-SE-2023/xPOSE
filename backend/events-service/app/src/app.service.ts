import { Injectable } from '@nestjs/common';
import admin =  require('firebase-admin');
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

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
    // await eventRef.update(eventDto);
    await eventRef.set(eventDto, { merge: true });
    return true;
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    const db = admin.firestore();
    await db.collection('events').doc(eventId).delete();
    return true;
  }
}
