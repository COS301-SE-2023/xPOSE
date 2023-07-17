import { Component, OnInit } from "@angular/core";
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
@Component({
	selector: "app-create-event",
	templateUrl: "./create-event.page.html",
	styleUrls: ["./create-event.page.scss"],
	})
export class CreateEventPage implements OnInit {

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
	  
	  displayMap() {
		// code to display map
		// console.log('Loading map');
		// const mapContainer = document.getElementById('map');
		// console.log(`map container ${mapContainer}`);
		
		// if (mapContainer instanceof HTMLElement) {
		//   console.log(`Loading map`);
		//   const mapOptions: google.maps.MapOptions = {
		// 	center: { lat: parseFloat(this.event.latitude), lng: parseFloat(this.event.longitude) },
		// 	zoom: 14,
		//   };
		  
		//   console.log(`Attributes showing ${this.event.latitude} ${this.event.longitude}`);
		//   this.map = new google.maps.Map(mapContainer, mapOptions);
		  
		//   console.log(`Map loaded`);
		//   this.marker = new google.maps.Marker({
		// 	position: { lat: parseFloat(this.event.latitude), lng: parseFloat(this.event.longitude) },
		// 	map: this.map,
		// 	title: 'Event Location',
		//   });
		//   console.log(`Marker loaded`);
		// } else {
		//   console.error('Map container element not found');
		// }
	  }

	  CreateEvent() {
		this.getCurrentUserId().subscribe((userId) => {
			if(userId){
				this.buttonClicked = true;
				this.loading = true;
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
			  
				// REfactor this to be done in the service class for better decoupling
				const url = 'http://localhost:8000/e/events';
			  
				this.http.post(url, formData)
				  .subscribe({
					next: (response:any) => {
					  // console.log(response);
					  this.openEventModal(response.id);
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
