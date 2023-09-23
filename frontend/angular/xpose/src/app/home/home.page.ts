import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from "../shared/services/auth.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Observable, map } from "rxjs";
import { get } from "http";
import { ApiService } from "../service/api.service";
import { MenuController } from '@ionic/angular';

@Component({
	selector: "app-home",
	templateUrl: "./home.page.html",
	styleUrls: ["./home.page.scss"]
})


export class HomePage {
	currentPageName = 'xPose';
	tags: string[] = ['Angular', 'Ionic', 'JavaScript', 'TypeScript', 'HTML', 'CSS'];

	loading: boolean = true;
	searchResults: { title: string; description: string; }[] | undefined;
	constructor(
		private afs: AngularFirestore,
		public authService: AuthService,
		private router: Router,
		private http: HttpClient,
		private afAuth: AngularFireAuth,
		private api: ApiService,
		private menuController: MenuController
		) {
	
	   }

	   menuItemClicked(item: string) {
		console.log(`Clicked on ${item}`);
		this.menuController.close('menu');
	  }

	ngOnInit() {
		this.getEventsFromAPI();

		
	}


	   
  getEventsFromAPI() {

	this.getCurrentUserId().subscribe((uid) => {
		if(uid){
			console.log(`We got that ${uid}`);
			this.http.get<Event[]>(`${this.api.apiUrl}/e/events?uid=${uid}`).subscribe((events: Event[]) => {
				console.log(events);
				  this.events = events;
				this.populateCards();
			  });
		}
		else {
			console.log("no user id");
			
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
		this.events.sort((a,b) => new Date(b.id).getTime() - new Date(a.id).getTime());
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
		  date: new Date(event.start_date).toDateString(),		  
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
	onFriends(){
		this.router.navigate(['/friends']);
	}



	// // Initialize Swiper
	// var tagsSwiper = new Swiper('#tags-swiper', {
	// 	slidesPerView: 1, // Number of slides per view
	// 	spaceBetween: 10, // Space between slides
	// 	pagination: {
	// 	el: '.swiper-pagination', // Pagination element
	// 	clickable: true, // Enable pagination clickable
	// 	},
	// });

}