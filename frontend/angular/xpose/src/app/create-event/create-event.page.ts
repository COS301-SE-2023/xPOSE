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
import { map } from "rxjs/operators";
import { ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
// import { google } from 'google-maps';
@Component({
	selector: "app-create-event",
	templateUrl: "./create-event.page.html",
	styleUrls: ["./create-event.page.scss"],
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
		privacy_setting: ' ',
		latitude: 0,
		longitude: 0,
		
	  };
	  route: any;
	  buttonClicked = false;
	  loading = false;

	  map: google.maps.Map | null;
	  marker: google.maps.Marker | null;
	

	constructor(private http: HttpClient,
		private router: Router,
		private service: Service,
		private modalController: ModalController,
		private afAuth: AngularFireAuth) {
			this.map = null;
			this.marker = null;
		}
	ngAfterViewInit(): void {
		// throw new Error("Method not implemented.");
		// this.displayMap();
		// this.initAutocomplete();
		this.initMap();
	}

	ngOnInit(): void {}

	onFileSelected(event: any) {
		const file: File = event.target.files[0];
		this.createEvent.image = file;
		// You can perform further operations with the selected file, such as uploading it to a server or displaying a preview.
		// Remember to update your component's property (e.g., createEvent.coverImage) with the selected file or file data.
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

	  initMap(): void {
		this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
			center: { lat: 1.3521, lng: 103.8198 },
			zoom: 15,
		});

		this.map.addListener('click', (e) => {
			this.placeMarker(e.latLng);
		});

		// Add autocomplete to search bar
		const input = document.getElementById('locationInput') as HTMLInputElement;
		const searchBox = new google.maps.places.SearchBox(input);
		this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		// Bias the SearchBox results towards current map's viewport.
		this.map.addListener('bounds_changed', () => {
			searchBox.setBounds(this.map!.getBounds() as google.maps.LatLngBounds);
		});

		// Update map and marker when a place is selected from the search bar
		searchBox.addListener('places_changed', () => {
			const places = searchBox.getPlaces();

			if (places.length == 0) {
				return;
			}

			// Clear out the old markers.
			this.marker?.setMap(null);

			// Set map center and marker position to the selected place.
			if(places[0].geometry?.viewport)
			
			this.map?.setCenter(places[0].geometry.location);
			this.placeMarker(places[0].geometry?.location);
		});
	  }

	  placeMarker(location: any) {
		if (this.marker) {
		  this.marker.setMap(null);
		}

		this.marker = new google.maps.Marker({
		  position: location,
		  map: this.map || new google.maps.Map(document.getElementById('map') as HTMLElement, {}),
		});
		
		this.createEvent.latitude = location.lat();
		this.createEvent.longitude = location.lng();
	  }

	  initAutocomplete() {
		const input = document.getElementById('locationInput') as HTMLInputElement;
		const autocomplete = new google.maps.places.Autocomplete(input);
		// Add listener to the input element
		autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace();
			if (!place.geometry) {
				// User entered the name of a Place that was not suggested and
				// pressed the Enter key, or the Place Details request failed.
				console.error('No details available for input: ' + place.name);
				return;
			}
			// For each place, get the icon, name and location.
			const bounds = new google.maps.LatLngBounds();
			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			}
			else {
				bounds.extend(place.geometry.location);
			}
			this.createEvent.latitude = place.geometry.location.lat();
			this.createEvent.longitude = place.geometry.location.lng();
			this.displayMap();
		});
	  }
	  
	  displayMap() {
		// code to display map
		// console.log('Loading map');
		const mapContainer = document.getElementById('map');
		console.log(`map container ${mapContainer}`);
		
		if (mapContainer instanceof HTMLElement) {
		  console.log(`Loading map`);
		  const mapOptions: google.maps.MapOptions = {
			center: { lat: parseFloat(this.createEvent.latitude.toString()), lng: parseFloat(this.createEvent.longitude.toString()) },
			zoom: 14,
		  };
		  
		  console.log(`Attributes showing ${this.createEvent.latitude} ${this.createEvent.longitude}`);
		  this.map = new google.maps.Map(mapContainer, mapOptions);
		  
		  console.log(`Map loaded`);
		  this.marker = new google.maps.Marker({
			position: { lat: parseFloat(this.createEvent.latitude.toString()), lng: parseFloat(this.createEvent.longitude.toString()) },
			map: this.map,
			title: 'Event Location',
		  });
		  console.log(`Marker loaded`);
		} else {
		  console.error('Map container element not found');
		}
	  }

	  CreateEvent(form: NgForm) {
		if(form.valid){
			this.getCurrentUserId().subscribe((userId) => {
				if(userId){
					this.buttonClicked = true;
					this.loading = true;
					const geocoder = new google.maps.Geocoder();
					const location = new google.maps.LatLng(
					  this.createEvent.latitude,
					  this.createEvent.longitude
					);
	
					geocoder.geocode({ location }, (results, status) => {
					  if (status === 'OK') {
						if (results[0]) {
						  this.createEvent.location = results[0].formatted_address;
						  console.log(results[0].formatted_address);
						} else {
						  console.log('No results found');
						}
					  } else {
						console.log('Geocoder failed due to: ' + status);
					  }
	
					  // this.createEvent.userId = parseInt(userId);
					  const formData: FormData = new FormData();
					  formData.append('uid', userId);
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
					  const url = 'http://localhost:8000/e/events';
					
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
	  

	goBack(){
		this.router.navigate(["/home"]);
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
