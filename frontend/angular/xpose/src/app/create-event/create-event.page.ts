import { AfterViewInit, Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Service } from "../service/service";
import { Event } from '../shared/event';
import { IonicModule, ModalController } from '@ionic/angular';
import { EventModal } from '../event-modal/event-modal';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Observable } from "rxjs";
import '@angular/compiler';
import { map } from "rxjs/operators";
import { ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ApiService } from "../service/api.service";
import { AuthService } from "../shared/services/auth.service";
import { LocationAutocompleteService } from "../service/location-autocomplete.service";

@Component({
	selector: "app-create-event",
	templateUrl: "./create-event.page.html",
	styleUrls: ["./create-event.page.scss"],
	// imports: [PlaceAutocompleteComponent]
	})

export class CreateEventPage implements OnInit, AfterViewInit {

	createEvent: Event = {
		uid: 0,
		title: ' ',
		image: null,
		start_date: ' ',
		end_date: ' ',
		location: ' ',
		description: ' ',
		privacy_setting: 'public',
		latitude: 0,
		longitude: 0,
		
	  };
	  route: any;
	  buttonClicked = false;
	  loading = false;

	  map: google.maps.Map | null;
	  marker: google.maps.Marker | null;
	
	  tags: string[] = [];
	  tagInput: string = '';
	
	  addTag() {
		if (this.tagInput.trim() !== '') {
		  this.tags.push(this.tagInput.trim());
		  this.tagInput = '';
		}
	  }
	
	  removeTag(tag: string) {
		this.tags = this.tags.filter(t => t !== tag);
	  }

	constructor(private http: HttpClient,
		private router: Router,
		private api: ApiService,
		private modalController: ModalController,
		public authService: AuthService,
		private afAuth: AngularFireAuth,
		private locationAutocompleteService: LocationAutocompleteService) {
			this.map = null;
			this.marker = null;
		}
	ngAfterViewInit(): void {
	}

	locationPredictions: any[] = [];

	onPrivacyChange() {
		console.log('Privacy changed:', this.createEvent.privacy_setting);
	  }

	ngOnInit(): void {}
	
	current_image_url: string = '';

	onFileSelected(event: any) {
		const file: File = event.target.files[0];
		this.createEvent.image = file;
		this.current_image_url = URL.createObjectURL(file);
	  }

	  getCurrentDate(): string {
		const now = new Date();
		const year = now.getUTCFullYear();
		const month = this.padNumber(now.getUTCMonth() + 1);
		const day = this.padNumber(now.getUTCDate());
		const hour = this.padNumber(now.getUTCHours());
		const minute = this.padNumber(now.getUTCMinutes());
		return `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
	  }
	  
	  padNumber(num: number): string {
		return num < 10 ? `0${num}` : `${num}`;
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

	  locationFilter: string = ''; // Added location filter variable
	  filteredLocations: string[] = []; // Array to hold filtered locations
	
	  // Existing constructor and methods
	
	  // Add this method to filter locations based on user input
	  filterLocations() {
		console.log('Filtering locations...');
		this.onLocationInput(this.locationFilter).then((some) => {
			console.log(some);
		}); // Call the location input handler
		// Replace this mock data with your actual list of locations
		// const locations = [
		//   "Location1",
		//   "Location2",
		//   "Location3",
		//   // Add more locations as needed
		// ];
	  
		// // Filter locations based on user input
		// this.filteredLocations = locations.filter((location) =>
		//   location.toLowerCase().includes(this.locationFilter.toLowerCase())
		// );
	  
		this.updateListHeight(); // Update the list height after filtering
	  }
	  selectedLocation: string | null = null; // Variable to store the selected location

	  // ...
	  
	  listHeight: number = 0; // Variable to store the dynamic height of the ion-list

	  // ...
	  
	  // Method to update the height of the ion-list based on filtered locations
	  updateListHeight() {
		// Calculate the height based on the number of filtered locations
		const itemHeight = 48; // Adjust this value based on your item height
		this.listHeight = this.filteredLocations.length * itemHeight;
	  }
	  
	  // Method to select a location from the dropdown list
	  selectLocation(location: string) {
		this.selectedLocation = location;
		this.createEvent.location = location; // Set the selected location in your form data
		this.filteredLocations = []; // Clear the dropdown list
		this.updateListHeight(); // Update the list height after selection
	  }
	// Function to fetch location predictions
	async onLocationInput(event: any) {
		console.log('Fetching location predictions...');
		try {
		this.locationPredictions = await this.locationAutocompleteService.getPlacePredictions(event.target.value);
		console.log(this.locationPredictions);
		} catch (error) {
		console.error('Error fetching location predictions:', error);
		}
	}

// Function to handle location selection
onLocationSelect(prediction: any) {
	console.log('Selected location:', prediction.description);
	
	const geocoder = new google.maps.Geocoder();
	geocoder.geocode({ address: prediction.description }, (results, status) => {
	  if (status === 'OK' && results && results[0]) {
		const location = results[0].geometry.location;
		this.createEvent.location = prediction.description;
		this.createEvent.latitude = location.lat();
		this.createEvent.longitude = location.lng();
		
		console.log('Location selected:', this.createEvent.location);
		console.log('Latitude:', this.createEvent.latitude);
		console.log('Longitude:', this.createEvent.longitude);
	  } else {
		console.log('Geocoding failed due to: ' + status);
	  }
	});
  
	this.locationPredictions = []; // Clear the predictions
  }
  

	  

	CreateEvent(form: NgForm) {
	const formData: FormData = new FormData();
	formData.append('title', this.createEvent.title);
	formData.append('start_date', this.createEvent.start_date);
	formData.append('end_date', this.createEvent.end_date);
	formData.append('location', this.createEvent.location);
	formData.append('description', this.createEvent.description);
	formData.append('privacy_setting', this.createEvent.privacy_setting);
	formData.append('latitude', this.createEvent.latitude.toString());
	formData.append('longitude', this.createEvent.longitude.toString());
	if(this.createEvent.title != " " || this.createEvent.start_date != " " || this.createEvent.end_date != " " || this.createEvent.location != " " || this.createEvent.description != " " || this.createEvent.longitude != 0 || this.createEvent.latitude != 0){
		this.getCurrentUserId().subscribe((uid) => {
			if(uid){
				this.buttonClicked = true;
				this.loading = true;
					// this.createEvent.userId = parseInt(userId);
					const formData: FormData = new FormData();
					formData.append('uid', uid);
					formData.append('title', this.createEvent.title);
					if (this.createEvent.image) {
					formData.append('image', this.createEvent.image, this.createEvent.image.name);
					}
					formData.append('start_date', this.createEvent.start_date);
					formData.append('end_date', this.createEvent.end_date);
					formData.append('location', this.createEvent.location);
					formData.append('description', this.createEvent.description);
					formData.append('privacy_setting', this.createEvent.privacy_setting);
					formData.append('latitude', this.createEvent.latitude.toString());
					formData.append('longitude', this.createEvent.longitude.toString());
				//   console.log(formData);
					console.log(this.createEvent);
					// REfactor this to be done in the service class for better decoupling
					const url = `${this.api.apiUrl}/e/events?uid=${uid}`;
					
					this.http.post(url, formData)
					.subscribe({
						next: (response:any) => {
						console.log(response);
						this.openEventModal(response.code);
						// Handle the response from the server
						this.router.navigate(['/home']);
						},
						error: (error) => {
						// Handle any errors that occurred during the request
						console.error(error);
						this.loading = false;
						// Display an error message to the user or perform any necessary error handling
						}
					});
			}
			else {
				console.log("No user is currently logged in.");
				// ! throw error
			}
		});
	}
	else{
		console.log("Please fill in all the fields.");
	}
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

	async openEventModal(id:string) {
		console.log("OUR ID" + id);

		const modal = await this.modalController.create({
			component: EventModal,
			componentProps: {
				id
			}
		});
	
		await modal.present();
	}
	
}