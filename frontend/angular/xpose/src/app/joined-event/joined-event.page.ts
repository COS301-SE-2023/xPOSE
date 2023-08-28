import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { Observable, map } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-joined-event',
  templateUrl: './joined-event.page.html',
  styleUrls: ['./joined-event.page.scss'],
})
export class JoinedEventPage implements OnInit {
  loading: boolean = true;
  events: any[] = [];
  cards: any[] = [];
  filterType: string = 'Ongoing';
  filteredCards: any[] = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.getEventsFromAPI();
  }

    // Function to handle the card button click
  onCardButtonClick(eventId: string) {
    // Redirect to event details page with the event ID as a query parameter
    this.router.navigate(['/view-event'], { queryParams: { id: eventId } });
  }

  // Get events from mock data and display
  getEventsFromAPI() {
    this.getCurrentUserId().subscribe((uid) => {
      if (uid) {
        console.log(`We got that ${uid}`);
        this.http.get<Event[]>(`${this.api.apiUrl}/e/events?uid=${uid}&filter=participant`).subscribe((events: Event[]) => {
          console.log(events);
          this.events = events;
          this.populateCards();
          this.applyFilter();
          this.loading = false;
        });        
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
        id: event.code,
        created_at: event.createdAt,
        start_date: event.start_date,
        end_date: event.end_date,
        status: event.status,
        // Add event listener to the button
        buttonClick: () => {
          // Redirect to event details page
          this.onCardButtonClick(event.id);
        },
      }));
    }
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
        imageURL: event.imageUrl,
        id: event.code,
      }));
      }
  }
  
  applyFilter() {
    if (this.filterType === 'Ongoing') {
      this.filteredCards = this.cards.filter(card => card.status.toLowerCase() === 'ongoing');
    } else if (this.filterType === 'Upcoming') {
      this.filteredCards = this.cards.filter(card => card.status.toLowerCase() === 'upcoming');
    } else if (this.filterType === 'Ended') {
      this.filteredCards = this.cards.filter(card => card.status.toLowerCase() === 'ended');
    } else {
      this.filteredCards = this.cards; // Show all cards when no specific filter is selected
    }
  }
  
  search() {
		this.router.navigateByUrl('/search');
	}

  onEvent() {
    this.router.navigate(['/create-event']);
  }

  eventDetails(event_id: string) {
		this.router.navigate(['/view-event', event_id]);
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
  
  getStatusColor(status: string) {
    if (status === 'ongoing') {
      return 'success';
    } else if (status === 'upcoming') {
      return 'warning';
    } else {
      return 'danger';
    }
      }

      truncateText(text: string, words: number): string {
        if (!text) return '';
        const wordsArray = text.trim().split(' ');
        return wordsArray.slice(0, words).join(' ');
        }
}
