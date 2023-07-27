import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { CurrentEventDataService } from '../shared/current-event-data.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map } from 'rxjs';
import { Location } from '@angular/common';
import { NavigationEnd } from "@angular/router";
import { GalleryDataService } from './posts/gallery-lightbox/gallery-data.service';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Camera, CameraResultType } from '@capacitor/camera'; 

interface Item {
  imageSrc: string;
  imageAlt: string;
}

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage {
  event: Event;
  participants: any;
  private history: string[] = [];
  cards: any[] = []; // Array to store cards data
  filterType: string = 'Ongoing';
  loading: boolean = true;
  errorMessage: string | undefined;
  events: any[] = []; // Array to store events data
  // participants: Participant[] = [
  //   { name: 'John' },
  //   { name: 'Thabo' },
  //   { name: 'Naria' },
  //   // Add more participant objects as needed
  // ];

  data: Item[] = [
    { imageSrc: '../assets/images/download.jpg', imageAlt: '1' },
    { imageSrc: '../assets/images/qrcode.png', imageAlt: '2' },
    { imageSrc: '../assets/images/images.jpg', imageAlt: '3' },
    { imageSrc: '../assets/images/qrcode.png', imageAlt: '4' },
    { imageSrc: '../assets/images/image2.webp', imageAlt: '5' },
    { imageSrc: '../assets/images/image1.webp', imageAlt: '6' },{ imageSrc: '../assets/images/download.jpg', imageAlt: '1' },
    { imageSrc: '../assets/images/youth.jpg', imageAlt: '7' },
    { imageSrc: '../assets/images/images.jpg', imageAlt: '8' },
    { imageSrc: '../assets/images/youth.png', imageAlt: '9' },
    { imageSrc: '../assets/images/qrcode.png', imageAlt: '10' },
    { imageSrc: '../assets/images/image2.webp', imageAlt: '11' },
    
    // Add more items as needed...
  ];
  // router: any;

  // constructor(private galleryDataService: GalleryDataService) {
  //   this.galleryDataService.setData(this.data);
  // }


  @ViewChild('eventTabs', { static: false }) tabs: IonTabs | undefined;
  selectedTab: any;
  // participants: never[];
  qrCodeImage: string | undefined;
  // http: any;

  

  constructor(private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private currentEventDataService: CurrentEventDataService,
		private afAuth: AngularFireAuth,
    private location: Location,
    private galleryDataService: GalleryDataService,
    private afs: AngularFirestore,
    // private camera: Camera,
    ) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });

    this.galleryDataService.setData(this.data);
    
    // Mocked event data
    // this.event = {
    //   title: 'Sample Event',
    //   date: 'June 30, 2023',
    //   location: 'Sample Location',
    //   description: 'This is a sample event description.'
    // };

    this.event = {
      title: '',
      description: '',
      location: '',
      owner_id: '',
      start_date: new Date(),
      end_date: new Date(),
      image_url: '',
      privacy_setting: '',
      code: ''
    }
    // this.participants = [];
  }

  current_event: any;
  url: string | undefined;

  ngOnInit() {
    this.url = this.location.path();
    // give messageCollection stub value
    // this.messagesCollection = this.afs.collection<Message>(`Event-Chats/0/chats`);
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        // Redirect to home page if no event id is available
        this.navCtrl.navigateBack('/home');
        return;
      }

      // participants: Participants[] = [
      //   { name: 'John' },
      //   { name: 'Thabo' },
      //   { name: 'Naria' },
        // Add more participant objects as needed
      // ];
     

      const event_id = paramMap.get('id');

      console.log(`The event id = ${event_id}`);
      this.messagesCollection = this.afs.collection<Message>(`Event-Chats/${event_id}/chats`);
      
      this.getCurrentUserId().subscribe((uid) => {
        if (uid) {
          this.http.get(`http://localhost:8000/e/events/${event_id}?uid=${uid}`).subscribe((data) => {
            this.retrieveMessages();
            this.current_event = data;
            this.loading = false;
            console.log(this.current_event); 
            this.getEventParticipantsFromAPI();
            console.log(this.participants);
          },
          (error) => {
              this.loading = false; // Request completed with an error
              this.errorMessage = "Couldn't load event.";
              console.error(error);
          });
        }
        else {
          this.loading = false; // Request completed with an error
          console.log("no user id");
        }
      });

      // Fetch event data based on the route parameter
      // Call API or perform necessary logic to fetch event details
      // Assign the fetched data to this.event
      // console.log(event_id);

      console.log('Hello from event page');
      // // make api call to http://localhost:8000/e/events/{event_id}
      // this.http.get('http://localhost:8000/e/events/' + event_id).subscribe((res : any) => {
      //   console.log(res);
      //   this.event = res;
      //   // this.currentEventDataService.event_id = res._id;
      // });
    });
  }

  async openImageGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
  
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath;
    console.log(imageUrl);
    // Can be set to the src of an image now
    // imageElement.src = imageUrl;
  }

  // Function to handle the image upload
  uploadImage(imageData: string) {
    // Add your image upload logic here.
    // You can use HTTP requests or any other method to upload the image to your server.
    // Remember to handle the response and update the 'data' array accordingly with the new image.
  }

  getEventParticipantsFromAPI() {
    this.getCurrentUserId().subscribe((uid) => {
      if(uid) {
        this.http
          .get(`http://localhost:8000/e/events/${this.current_event.code}/participants?uid=${uid}`)
          .subscribe((data) => {
            this.participants = data;

            // this.event.participants.forEach((participant: any) => {
            //   participant.since_joining = this.formatDateSinceJoining(participant.join_date);
            // });

            console.log(data);
          });
      }
    });
  }


  back(): void {
    this.history.pop();
    if (this.history.length >= 0) {
      this.location.back();
    } else {
      this.router.navigate(['/home']);
    }
  }

  onCardClick(participant: any) {
    console.log('Card clicked');
    console.log(participant);
    this.router.navigateByUrl('/user-profile')
    // this.router.navigate(['/participant', participant.id]);

  }

  applyFilter() {
    if (this.filterType === 'posts') {
      this.cards = this.events.filter((event) => event.status === 'posts');
    } else if (this.filterType === 'message-board') {
      this.cards = this.events.filter((event) => event.status === 'message-board');
    } else if (this.filterType === 'Ended') {
      this.cards = this.events.filter((event) => event.status === 'details' || event.status === 'details');
    }
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

  ionViewWillEnter() {
    // Fetch event data based on the route parameter
    const event_id = this.activatedRoute.snapshot.paramMap.get('id');
    // Call API or perform necessary logic to fetch event details
    // Assign the fetched data to this.event
    
  }

  setCurrentTab() {
    this.selectedTab = this.tabs?.getSelected();
    console.log(this.selectedTab);
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

  // Code to create and send messages
  newMessage!: string;

  createMessage() {
    if (this.newMessage) {
      this.getCurrentUserId().subscribe((uid) => {
        const message: Message = {
          uid: uid,
          message: this.newMessage
        };

        this.newMessage = '';
        const event_id = this.current_event.code;
        const formData: FormData = new FormData();
        formData.append('message', message.message);

        this.http.post(`http://localhost:8000/c/chats/${event_id}?uid=${uid}`, formData).subscribe((res) => {
          console.log(res);
        });
      });
    }
  }

  messagesCollection: AngularFirestoreCollection<Message> | undefined;
  messages: Message[] = [];

  retrieveMessages() {
    if(this.messagesCollection) {
      this.messagesCollection.valueChanges().subscribe((messages: Message[]) => {
        this.messages = messages;
        
        // Fetch and assign the displayName for each message
        this.messages.forEach((message: Message) => {
          this.getUserNameFromUid(message.uid).subscribe((displayName: string) => {
            message.displayName = displayName;
          });
        });
        // console.log('Retrieving messages from Firestore...');
        // console.log(this.messages);
      });
    }
    else {
      console.log("messagesCollection is undefined");
    }
  }
  
  getUserNameFromUid(uid: string): Observable<string> {
    return this.afs.collection('Users').doc(uid).valueChanges().pipe(
      map((user: any) => {
        if (user && user.displayName) {
          return user.displayName;
        } else {
          return 'Unknown User';
        }
      })
    );
  }

  // Code to handle participants

  addParticipant(participant: any) {
    // Handle participant addition logic here
  
    // For demonstration, we'll add the participant back to the event object's participants array
    // this.event.participants.push(participant);
    this.participants.push(participant);
  }

  removeParticipant(participant: any) {
    const index = this.participants.indexOf(participant);
    if (index > -1) {
      this.participants.splice(index, 1);
    }
  }

}

interface Event {
  title: string;
  description: string;
  location: string;
  owner_id: string;
  start_date: Date;
  end_date: Date;
  image_url: string;
  privacy_setting: string;
  code: string;
}

interface Message {
  uid: string;
  displayName?: string; // Add displayName property
  message: string;
  id?: string;
  timestamp?: Date;
}
