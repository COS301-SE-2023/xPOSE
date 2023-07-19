import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-joined-event',
  templateUrl: './joined-event.page.html',
  styleUrls: ['./joined-event.page.scss'],
})
export class JoinedEventPage implements OnInit {
  loading: boolean = true;
	searchResults: { title: string; description: string; }[] | undefined;
	constructor(
		private afs: AngularFirestore,
		public authService: AuthService,
		private router: Router,
		private http: HttpClient,
		private afAuth: AngularFireAuth
		) {
	
	   }

	ngOnInit() {
		this.getEventsFromAPI();
	}
	   // get events from firebase and display
	   
  getEventsFromAPI() {

	this.getCurrentUserId().subscribe((uid) => {
		if(uid){
			console.log(`We got that ${uid}`);
			this.http.get<Event[]>(`http://localhost:8000/e/events?uid=${uid}`).subscribe((events: Event[]) => {
				console.log(events);
				  this.events = events;
				this.populateCards();
			  });
			  this.loading = false;
		}
		else {
			console.log("no user id");
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
			// throw error
			// some extra stuff
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
		this.cards = this.events.map(event => ({
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
		  // Add event listener to the button
		  buttonClick: function() {
			// Redirect to event details page
			console.log("Redirecting to event details page: ", event.id)
			// window.location.href = "/view-event/" + event.id;
		  }
		}));
	  }
  }
  events: any[] = [];

  cards: any[] = [

  ];

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
  filterType(){
    //implement filter
    
  }
  eventDetails() {
		this.router.navigate(['/view-event']);
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
