import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { Observable, map } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-joined-event',
  templateUrl: './joined-event.page.html',
  styleUrls: ['./joined-event.page.scss'],
})
export class JoinedEventPage implements OnInit {
  loading: boolean = true;
  events: any[] = []; // Array to store events data
  cards: any[] = []; // Array to store cards data

  constructor(
    public authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.getEventsFromMockData();
  }

  // Get events from mock data and display
  getEventsFromMockData() {
    this.getCurrentUserId().subscribe((uid) => {
      if (uid) {
        console.log(`We got that ${uid}`);
        // Replace this.events with mock data array
        this.events = [
          {
            title: 'Event 1',
            description: 'Description of Event 1',
            latitude: 40.7128,
            longitude: -74.0060,
            image_url: 'https://example.com/event1.jpg',
            id: 'event1',
            createdAt: '2023-07-01T12:00:00Z',
            start_date: '2023-07-10T18:00:00Z',
            end_date: '2023-07-10T22:00:00Z',
          },
          {
            title: 'Event 2',
            description: 'Description of Event 2',
            latitude: 34.0522,
            longitude: -118.2437,
            image_url: 'https://example.com/event2.jpg',
            id: 'event2',
            createdAt: '2023-07-02T12:00:00Z',
            start_date: '2023-07-15T10:00:00Z',
            end_date: '2023-07-15T16:00:00Z',
          },
          // Add more mock events as needed
        ];
        
        this.populateCards();
        this.loading = false;
      } else {
        console.log("No user id");
        this.loading = false;
      }
    });
  }

  getCurrentUserId(): Observable<string> {
    return this.afAuth.authState.pipe(
      map((user) => {
        if (user) {
          return user.uid;
        } else {
          console.log('No user is currently logged in.');
          return '';
        }
      })
    );
  }

  populateCards() {
    if (this.events.length === 0) {
      this.cards = []; // Empty the cards list when there are no events
    } else {
      this.cards = this.events.map((event) => ({
        title: event.title,
        location: `(${event.latitude}, ${event.longitude})`,
        description: '' + event.description,
        button: "Join event",
        image_url: event.image_url,
        longitude: event.longitude,
        latitude: event.latitude,
        id: event.id,
        created_at: event.createdAt,
        start_date: event.start_date,
        end_date: event.end_date,
        // Add event listener to the button
        buttonClick: function() {
          // Redirect to event details page
          console.log("Redirecting to event details page: ", event.id);
          // window.location.href = "/view-event/" + event.id;
        },
      }));
    }
  }

  // Other methods remain unchanged
  // ...
  
  loadJoinedEvents() {
    // Call your event service method to fetch joined events
    if (this.events.length === 0) {
      this.cards = []; // Empty the cards list when there are no events
      } else {
      this.cards = this.events.map(event => ({
        title: event.eventName,
        subtitle: event.eventDescription,
        description: '' + event.eventLocation,
        // button: "Join event",
        imageURL: event.imageUrl,
        id: event.id,
        // Add event listener to the button
        // buttonClick: function() {
        // // Redirect to event details page
        // window.location.href = "/event?id=" + event.id;
        // }
      }));
      }
  }
  applyFilter() {
  //   if (this.filterType === 'private') {
  //     this.filteredEvents = this.joinedEvents.filter((event) => event.type === 'private');
  //   } else if (this.filterType === 'public') {
  //     this.filteredEvents = this.joinedEvents.filter((event) => event.type === 'public');
  //   } else {
  //     this.filteredEvents = this.joinedEvents; // No filter applied
  //   }
  
  }
  filterType(){
    //implement filter
    
  }
  eventDetails() {
		this.router.navigate(['/event']);
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
