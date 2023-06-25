import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { admin } from './firebase.admin';
import multer from 'multer';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { AppService } from './app.service';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

// Itialized Cloud Storage and get a reference to the storage service, which is used to create references in your storage bucket and upload files:
const storage = getStorage();

// Setting up multer as middleware to grab photo uploads
const upload = multer({
  storage: multer.memoryStorage(),
});

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

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
