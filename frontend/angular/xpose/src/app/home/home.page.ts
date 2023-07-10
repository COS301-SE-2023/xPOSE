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
  events: any[] = [];

  cards: any[] = [
  	// {
  	// 	title: "Youth Day",
  	// 	subtitle: "Celebrating Youth Day",
  	// 	description: "Everyone is invited to celebrate Youth Day with us. We will be having a braai and drinks.",
  	// 	button: "Join event",
	// 	imageURL: 'assets/images/youth.jpg'
  	// },
  	// {
  	// 	title: "Family Day",
  	// 	subtitle: "Friends and family are invited to join us for a day of fun and games.",
  	// 	description: "We will be having a braai and drinks. event will be held at the park.",
  	// 	button: "Join event",
	// 	imageURL: 'assets/images/image1.webp'
		
  	// },
	//   {
	// 	title: "Quinceanera",
	// 	subtitle: "Birthday celebration",
	// 	description: "Dont forget to bring your dancing shoes and your appetite. Gifts are welcome.",
	// 	button: "Join event",
	// 	imageURL: 'assets/images/image2.webp'
	// },

  ];
  
	viewEvent() {
		this.router.navigate(['/event']);
	}
	eventDetails() {
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
	signOut(){
		console.log("Signing out...");
		this.authService.signOut();
		// console.log(this.authService.signOut());
   }
}
