import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})

export class HomePage {
  events: any[] = [];

  constructor() {
    // Generate random events
    for (let i = 0; i < 10; i++) {
      const event = {
        title: `Event ${i + 1}`,
        date: new Date().toLocaleDateString(),
        location: `Location ${i + 1}`
      };
      this.events.push(event);
    }
  }
}
