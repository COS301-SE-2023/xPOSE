import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-joined-event',
  templateUrl: './joined-event.page.html',
  styleUrls: ['./joined-event.page.scss'],
})
export class JoinedEventPage implements OnInit {
  joinedEvents: any[] = []; // Modify the data type as per your event structure
  filteredEvents: any[] = []; // Initialize as an empty array
  cards: any[] = []; // Initialize as an empty array
  events: any[] = [];
  filterType: string = 'private'; // Default filter type

  constructor(
    private afs: AngularFirestore,
		public authService: AuthService,
		private router: Router,
		private http: HttpClient

  ) {}

  populateCards() {
    if (this.events.length === 0) {
      this.cards = []; // Empty the cards list when there are no events
      } else {
      this.cards = this.events.map(event => ({
        title: event.eventName,
        subtitle: event.eventDescription,
        description: '' + event.eventLocation,
        button: "Join event",
        imageURL: event.imageUrl,
        id: event.id,
        // Add event listener to the button
        buttonClick: function() {
        // Redirect to event details page
        window.location.href = "/event?id=" + event.id;
        }
      }));
      }
    }

  ngOnInit() {
    this.getEventsFromAPI();
  }
  getEventsFromAPI() {
    this.http.get<Event[]>("http://localhost:8000/e/events").subscribe((events: Event[]) => {
      console.log(events);
		this.events = events;
      this.populateCards();
    });
  }

  loadJoinedEvents() {
    // Call your event service method to fetch joined events
    if (this.events.length === 0) {
      this.cards = []; // Empty the cards list when there are no events
      } else {
      this.cards = this.events.map(event => ({
        title: event.eventName,
        subtitle: event.eventDescription,
        description: '' + event.eventLocation,
        button: "Join event",
        imageURL: event.imageUrl,
        id: event.id,
        // Add event listener to the button
        buttonClick: function() {
        // Redirect to event details page
        window.location.href = "/event?id=" + event.id;
        }
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
