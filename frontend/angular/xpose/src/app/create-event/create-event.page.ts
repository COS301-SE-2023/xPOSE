import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Service } from "../service/service";
import { Event } from '../shared/event';
import { IonicModule, ModalController } from '@ionic/angular';
import { EventModal } from '../event-modal/event-modal';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

	constructor(private http: HttpClient, private router: Router,private service: Service, private modalController: ModalController) { }

	ngOnInit(): void {
	}

	onFileSelected(event: any) {
		const file: File = event.target.files[0];
		this.createEvent.coverImage = file;
		// You can perform further operations with the selected file, such as uploading it to a server or displaying a preview.
		// Remember to update your component's property (e.g., createEvent.coverImage) with the selected file or file data.
	  }

	CreateEvent(){
		const formData: FormData = new FormData();
		formData.append('userId', this.createEvent.userId.toString());
		formData.append('eventName', this.createEvent.eventName);
		if (this.createEvent.coverImage) {
			formData.append('coverImage', this.createEvent.coverImage, this.createEvent.coverImage.name);
		  }
		formData.append('eventStartDate', this.createEvent.eventStartDate);
		formData.append('eventEndDate', this.createEvent.eventEndDate);
		formData.append('eventLocation', this.createEvent.eventLocation);
		formData.append('eventDescription', this.createEvent.eventDescription);
		formData.append('eventPrivacySetting', this.createEvent.eventPrivacySetting);
		this.service.CreateEvent(this.createEvent)
		.subscribe({
		  next: (event) => {
			this.router.navigate(['/home']);
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

	async openEventModal() {
	const modal = await this.modalController.create({
		component: EventModal,
	//   componentProps: {
	// 	totalPrice: this.getTotalPrice()
	//   }
	});
	
	await modal.present();
	}
	
}
