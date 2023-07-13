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
		userId: 0,
		eventName: ' ',
		coverImage: null,
		eventStartDate: ' ',
		eventEndDate: ' ',
		eventLocation: ' ',
		eventDescription: ' ',
		eventPrivacySetting: ' '
	  };
	  route: any;
	  buttonClicked = false;
	  loading = false;

	constructor(private http: HttpClient,
		private router: Router,
		private service: Service,
		private modalController: ModalController,
		private afAuth: AngularFireAuth) { }

	ngOnInit(): void {}

	onFileSelected(event: any) {
		const file: File = event.target.files[0];
		this.createEvent.coverImage = file;
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
	  

	  CreateEvent() {
		this.getCurrentUserId().subscribe((userId) => {
			if(userId){
				this.buttonClicked = true;
				this.loading = true;
				// this.createEvent.userId = parseInt(userId);
				const formData: FormData = new FormData();
				formData.append('userId', userId);
				formData.append('eventName', this.createEvent.eventName);
				if (this.createEvent.coverImage) {
				  formData.append('coverImage', this.createEvent.coverImage, this.createEvent.coverImage.name);
				}
				formData.append('eventStartDate', this.createEvent.eventStartDate);
				formData.append('eventEndDate', this.createEvent.eventEndDate);
				formData.append('eventLocation', this.createEvent.eventLocation);
				formData.append('eventDescription', this.createEvent.eventDescription);
				formData.append('eventPrivacySetting', this.createEvent.eventPrivacySetting);
			  
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
