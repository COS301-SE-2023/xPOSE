import { Component } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage {
  eventName: string;
  eventDate: Date;
  eventLocation: string;
  
  constructor() {
    // Initialize the event details
    this.eventName = 'My Event';
    this.eventDate = new Date('2023-06-25');
    this.eventLocation = 'Event Venue';
  }
}
