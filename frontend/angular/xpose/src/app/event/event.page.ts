// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-event',
//   templateUrl: './event.page.html',
//   styleUrls: ['./event.page.scss'],
// })
// export class EventPage implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage {
  event: { title: string, date: string, location: string, description: string };

  constructor(private activatedRoute: ActivatedRoute) {
    // Mocked event data
    this.event = {
      title: 'Sample Event',
      date: 'June 30, 2023',
      location: 'Sample Location',
      description: 'This is a sample event description.'
    };
  }

  ionViewWillEnter() {
    // Fetch event data based on the route parameter
    const eventId = this.activatedRoute.snapshot.paramMap.get('id');
    // Call API or perform necessary logic to fetch event details
    // Assign the fetched data to this.event
  }
}
