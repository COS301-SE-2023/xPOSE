import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from "../shared/services/auth.service";



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

  constructor(
	private afs: AngularFirestore,
	public authService: AuthService) {
	 // perform simplem query to check firebase connection
	 const collectionRef = this.afs.collection('Users');
	 collectionRef.get().subscribe((snapshot) => {
	   console.log('Firebase connection is successful!');
	   /*snapshot.docs.forEach((doc) =>{
		console.log(doc.ref);
	   });*/  
	 
	 }, (error) => {
	   console.error('Firebase connection failed:', error);
	 });
   }

   signOut(){
	console.log("Signing out...");
	this.authService.signOut();
	// console.log(this.authService.signOut());
   }

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
