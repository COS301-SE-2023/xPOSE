import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { Observable, map } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../service/api.service';
//import { get } from 'cypress/types/lodash';

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

  tags: string[] = [];
  // Get events from mock data and display
  getEventsFromAPI() {
    this.getCurrentUserId().subscribe((uid) => {
      if(uid){
        // this.http.get(`${this.api.apiUrl}/e/tags?n=${10}}`)
        // .subscribe((data: any) => {
        //   console.log(data);
        //   this.tags = data;
        // });
  
        this.tags = ['all', 'ongoing', 'upcoming', 'ended', 'my events'];

        // console.log(`We got that ${uid}`);
        this.http.get<Event[]>(`${this.api.apiUrl}/e/feed?uid=${uid}`).subscribe((events: Event[]) => {
          // console.log(events);
          this.events = events;
          this.populateCards();
        });
      }
      else {
        console.log("no user id");
        
      }
    });
    }

    chipColors: { [key: string]: string } = {
      'all': 'chip-all',
      'ongoing': 'chip-ongoing',
      'upcoming': 'chip-upcoming',
      'ended': 'chip-ended',
      'my events': 'chip-my-events'
    };

  refreshFeed(query: string) {
		// filter based on query
    this.getCurrentUserId().subscribe((uid) => {
      switch(query) {
        case 'ongoing':
          this.filteredCards = this.cards.filter(card => card.status.toLowerCase() === 'ongoing');
          break;
        case 'upcoming':
          this.filteredCards = this.cards.filter(card => card.status.toLowerCase() === 'upcoming');
          break;
        case 'ended':
          this.filteredCards = this.cards.filter(card => card.status.toLowerCase() === 'ended');
          break;
        case 'my events':
          this.filteredCards = this.cards.filter(card => card.owner === uid);
          break;
        default:
          this.filteredCards = this.cards;
          break;
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
      this.cards = [];
      } else {
      this.events.sort((a,b) => new Date(b.id).getTime() - new Date(a.id).getTime());
      this.cards = this.events.map(event => ({
        title: event.title,
        location: event.location,
        description: '' + event.description,
        owner: event.owner,
        button: "Join event",
        image_url: event.image_url,
        longitude: event.longitude,
        latitude: event.latitude,
        status: event.status,
        id: event.code,
        created_at: event.createdAt,
        start_date: event.start_date,
        end_date: event.end_date,
        date: new Date(event.start_date).toDateString(),	
        tags: event.tags,	  
        // Add event listener to the button
        buttonClick: function() {
        // Redirect to event details page
        console.log("Redirecting to event details page: ", event.id)
        
        // window.location.href = "/view-event/" + event.id;
        }
      }));
      this.filteredCards = this.cards;
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
	
	eventDetails(event_id: string) {
		this.router.navigate(['/view-event', event_id]);
	}

	viewEvent() {
		this.router.navigate(['/event']);
		}
	
		  onEvent(){
			this.router.navigate(['/create-event']);
		}
	
		onNotifications(){
			this.router.navigate(['/notification']);
		}
		
		onProfile(){
			this.router.navigate(['/profile']);
		}  
	
		onJoinedEvent(){
			this.router.navigate(['/joined-event']);
		}
	
		onHome(){
			this.router.navigate(['/home']);
		}
	
		onSettings(){
			this.router.navigate(['/settings']);
		}
		
	   logout() {
		this.authService.signOut();
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
