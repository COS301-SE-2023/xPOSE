import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-joined-event',
  templateUrl: './joined-event.page.html',
  styleUrls: ['./joined-event.page.scss'],
})
export class JoinedEventPage implements OnInit {
  joinedEvents: any[] = []; // Modify the data type as per your event structure
  filteredEvents: any[] = []; // Initialize as an empty array
  filterType: string = 'private'; // Default filter type

  // constructor() {}
  constructor(private router: Router) {}
  ngOnInit() {
    this.loadJoinedEvents();
  }

  loadJoinedEvents() {
    // Call your event service method to fetch joined events
    // Example code:
    this.joinedEvents = [
      { id: 1, name: 'Private Event 1', type: 'private' },
      { id: 2, name: 'Private Event 2', type: 'private' },
      { id: 3, name: 'Public Event 1', type: 'public' },
      { id: 4, name: 'Public Event 2', type: 'public' },
    ];
    this.applyFilter(); // Apply the initial filter
  }

  applyFilter() {
    if (this.filterType === 'private') {
      this.filteredEvents = this.joinedEvents.filter((event) => event.type === 'private');
    } else if (this.filterType === 'public') {
      this.filteredEvents = this.joinedEvents.filter((event) => event.type === 'public');
    } else {
      this.filteredEvents = this.joinedEvents; // No filter applied
    }
  }
  onEvent() {
    this.router.navigate(['/create-event']);
  }

  onNotifications() {
    this.router.navigate(['/notification']);
  }

  onProfile() {
    this.router.navigate(['/profile']);
  }

  onJoinedEvent() {
    this.router.navigate(['/joined-event']);
  }

  onHome() {
    this.router.navigate(['/home']);
  }
}
