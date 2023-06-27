import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  userEvents: any[] | undefined; // Define the userEvents property as an array to hold event data

  constructor() { }

  ngOnInit() {
    // Populate the userEvents array with event data
    this.userEvents = [
      { name: 'Event 1', description: 'Description 1' },
      { name: 'Event 2', description: 'Description 2' },
      // Add more events as needed
    ];
  }
}
