import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-page',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss']
})
export class EventPage implements OnInit {
  event: {
    title: string,
    description: string,
    date: string,
    location: string,
    linkUrl: string,
    linkText: string
  } = {
    title: '',
    description: '',
    date: '',
    location: '',
    linkUrl: '',
    linkText: ''
  };

  ngOnInit(): void {
    // Initialize event data
    this.event = {
      title: 'Sample Event',
      description: 'This is a sample event.',
      date: '2023-06-10',
      location: 'Sample Location',
      linkUrl: 'https://example.com',
      linkText: 'Register Now'
    };
  }
}
