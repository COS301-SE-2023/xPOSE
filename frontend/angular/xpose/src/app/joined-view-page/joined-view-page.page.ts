import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-joined-view-page',
  templateUrl: './joined-view-page.page.html',
  styleUrls: ['./joined-view-page.page.scss'],
})
export class JoinedViewPagePage implements OnInit {

  event: any = {
    title: 'Sample Event',
    owner: 'John Doe',
    latitude: 40.7128,
    longitude: -74.0060,
    description: 'This is a sample event description. Lorem ipsum dolor sit amet...',
    participants: [
      { username: 'user1', name: 'User One', description: 'Participant One' },
      { username: 'user2', name: 'User Two', description: 'Participant Two' },
      // Add more participants as needed
    ],
    user_event_position: 'Joined',
    image_url: '../assets/images/youth.jpg',
  };

  constructor() {}

  ngOnInit() {}
}