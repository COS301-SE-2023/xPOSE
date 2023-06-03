import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  events: any[] = [];

  cards = [
    {
      title: 'Title',
      subtitle: 'Subtitle 1',
      description: 'Description 1',
      button: 'Join event'
    },
    {
      title: 'Title 2',
      subtitle: 'Subtitle 2',
      description: 'Description 2',
      button: 'Join event'
    }
  ];

  constructor() { }
}
