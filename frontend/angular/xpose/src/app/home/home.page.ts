import { Component } from "@angular/core";
import { Router } from "@angular/router";
// import { Firestore, addDoc, collection, collectionData } from "@angular/fire/firestore";
// import { getAuth } from "@angular/fire/auth";
// import { Observable } from "rxjs";


@Component({
	selector: "app-home",
	templateUrl: "./home.page.html",
	styleUrls: ["./home.page.scss"]
})


export class HomePage {
	constructor(private router: Router) {}
  events: any[] = [];

  cards = [
  	{
  		title: "Youth Day",
  		subtitle: "Celebrating Youth Day",
  		description: "Everyone is invited to celebrate Youth Day with us. We will be having a braai and drinks.",
  		button: "Join event",
		imageURL: 'assets/images/youth.jpg'
  	},
  	{
  		title: "Family Day",
  		subtitle: "Friends and family are invited to join us for a day of fun and games.",
  		description: "We will be having a braai and drinks. event will be held at the park.",
  		button: "Join event",
		imageURL: 'assets/images/image1.webp'
		
  	},
	  {
		title: "Quinceanera",
		subtitle: "Birthday celebration",
		description: "Dont forget to bring your dancing shoes and your appetite. Gifts are welcome.",
		button: "Join event",
		imageURL: 'assets/images/image2.webp'
	},

  ];

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
}

//   constructor(private afs: Firestore) {
// 		console.log("this.afs: "+ this.afs);
//    }

   /*
   addEvent(event: Event){
		// add an event
		event.event_name = "Party testing";
		event.location = "Pretoria";
		event.visibility = true;
		// const user = getAuth().currentUser;
		console.log("this.afs: "+ this.afs);
		// console.log("Authenticated user is: " + userId);
		addDoc(collection(this.afs, 'Events'), event);
   }*/

   /*
   getEvents(): Observable<Event>{
	let eventsRef = collection(this.afs, " Events");
	return collectionData(eventsRef, {idField: 'id'}) as Observable<Event>;
   }*/

