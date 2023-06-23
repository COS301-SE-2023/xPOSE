import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getEvents(): Promise<Event[]> {
    return this.appService.getEvents();
  }

  @Post()
  async createEvent(@Body() eventDto: CreateEventDto): Promise<string> {
    return this.appService.createEvent(eventDto);
  }

  @Get(':id')
  async getEventById(@Param('id') eventId: string): Promise<Event | null> {
    return this.appService.getEventById(eventId);
  }

  @Put(':id')
  async updateEvent(
    @Param('id') eventId: string,
    @Body() eventDto: UpdateEventDto,
  ): Promise<boolean> {
    return this.appService.updateEvent(eventId, eventDto);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') eventId: string): Promise<boolean> {
    return this.appService.deleteEvent(eventId);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
