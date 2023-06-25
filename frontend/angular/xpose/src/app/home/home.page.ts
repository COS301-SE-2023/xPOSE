import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from "../shared/services/auth.service";



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

  constructor(
	private afs: AngularFirestore,
	public authService: AuthService) {
	 // perform simplem query to check firebase connection
	//  const collectionRef = this.afs.collection('Users');
	//  collectionRef.get().subscribe((snapshot) => {
	//    console.log('Firebase connection is successful!');
	   /*snapshot.docs.forEach((doc) =>{
		console.log(doc.ref);
	   });*/  
	 
	//  }, (error) => {
	//    console.error('Firebase connection failed:', error);
	//  });
   }

   signOut(){
	console.log("Signing out...");
	this.authService.signOut();
	// console.log(this.authService.signOut());
   }
}
