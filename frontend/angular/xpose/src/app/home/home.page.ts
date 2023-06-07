import { Component } from "@angular/core";
// import { Firestore, addDoc, collection, collectionData } from "@angular/fire/firestore";
// import { getAuth } from "@angular/fire/auth";
// import { Observable } from "rxjs";


@Component({
	selector: "app-home",
	templateUrl: "./home.page.html",
	styleUrls: ["./home.page.scss"]
})


export class HomePage {
  events: any[] = [];

  cards = [
  	{
  		title: "Title",
  		subtitle: "Subtitle 1",
  		description: "Description 1",
  		button: "Join event"
  	},
  	{
  		title: "Title 2",
  		subtitle: "Subtitle 2",
  		description: "Description 2",
  		button: "Join event"
  	}
  ];

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
}
