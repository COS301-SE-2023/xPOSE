import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class AppService {
    getHello(): string;
    getEvents(): Promise<Event[]>;
    createEvent(eventDto: CreateEventDto): Promise<string>;
    getEventById(eventId: string): Promise<Event | null>;
    updateEvent(eventId: string, eventDto: UpdateEventDto): Promise<boolean>;
    deleteEvent(eventId: string): Promise<boolean>;
    uploadImage(file: Express.Multer.File): Promise<string>;
}
