import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Service } from "../service/service";
import { Event } from '../shared/event';

@Component({
	selector: "app-create-event",
	templateUrl: "./create-event.page.html",
	styleUrls: ["./create-event.page.scss"],
	})
export class CreateEventPage implements OnInit {

	createEvent: Event = {
		userId: 0,
		eventName: ' ',
		coverImage: ' ',
		//eventStartDate: ' ',
		//eventEndDate: ' ',
		eventLocation: ' ',
		eventDescription: ' ',
		eventPrivacySetting: ' '
	  };
	  route: any;

	constructor(private http: HttpClient, private router: Router,private service: Service) { }

	ngOnInit(): void {
	}

	CreateEvent(){
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

	redirectToEventPage() {
		this.router.navigate(['/event']);
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
