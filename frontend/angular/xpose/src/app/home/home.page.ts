import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from "../shared/services/auth.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Observable, map } from "rxjs";
import { get } from "http";



@Component({
	selector: "app-home",
	templateUrl: "./home.page.html",
	styleUrls: ["./home.page.scss"]
})


export class HomePage {
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

  truncateText(text: string, words: number): string {
	if (!text) return '';
	const wordsArray = text.trim().split(' ');
	return wordsArray.slice(0, words).join(' ');
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

  // Function to handle status label color
  getStatusColor(status: string) {
	if (status === 'ongoing') {
		return 'success';
	} else if (status === 'upcoming') {
		return 'warning';
	} else {
		return 'danger';
	}
	  }

 populateCards() {
	if (this.events.length === 0) {
		this.cards = [];
	  } else {
		this.cards = this.events.map(event => ({
		  title: event.title,
		  location: event.location,
		  description: '' + event.description,
		  button: "Join event",
		  image_url: event.image_url,
		  longitude: event.longitude,
		  latitude: event.latitude,
		  status: event.status,
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

	search() {
		this.router.navigateByUrl('/search');
	}
	viewEvent() {
		this.router.navigate(['/event']);
	}
	eventDetails(event_id: string) {
		this.router.navigate(['/view-event', event_id]);
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
	signOut(){
		console.log("Signing out...");
		this.authService.signOut();
		// console.log(this.authService.signOut());
   }
}
