import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from "../shared/services/auth.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";



@Component({
	selector: "app-home",
	templateUrl: "./home.page.html",
	styleUrls: ["./home.page.scss"]
})


export class HomePage {
	constructor(
		private afs: AngularFirestore,
		public authService: AuthService,
		private router: Router,
		private http: HttpClient
		) {
	
	   }

	ngOnInit() {
		this.getEventsFromAPI();
	}
	   // get events from firebase and display
	   
  getEventsFromAPI() {
    this.http.get<Event[]>("http://localhost:8000/e/events").subscribe((events: Event[]) => {
      console.log(events);
		this.events = events;
      this.populateCards();
    });
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
		  // Add event listener to the button
		  buttonClick: function() {
			// Redirect to event details page
			window.location.href = "/event?id=" + event.id;
		  }
		}));
	  }
  }
  events: any[] = [];

  cards: any[] = [

  ];
  
	viewEvent() {
		this.router.navigate(['/event']);
	}
	eventDetails() {
		this.router.navigate(['/view-event']);
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
