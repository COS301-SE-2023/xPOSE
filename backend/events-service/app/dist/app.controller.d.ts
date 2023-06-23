import { AppService } from './app.service';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getEvents(): Promise<Event[]>;
    createEvent(eventDto: CreateEventDto): Promise<string>;
    getEventById(eventId: string): Promise<Event | null>;
    updateEvent(eventId: string, eventDto: UpdateEventDto): Promise<boolean>;
    deleteEvent(eventId: string): Promise<boolean>;
    getHello(): string;
}
