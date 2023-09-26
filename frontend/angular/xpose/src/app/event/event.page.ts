import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { CurrentEventDataService } from '../shared/current-event-data.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map, subscribeOn } from 'rxjs';
import { Location } from '@angular/common';
import { NavigationEnd } from "@angular/router";
import { GalleryDataService } from './posts/gallery-lightbox/gallery-data.service';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; 
import { ApiService } from '../service/api.service';

import { ModalController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GalleryModalComponent } from '../gallery-modal/gallery-modal.component';
import { Service } from '../service/service';

import { AuthService } from '../shared/services/auth.service';

// import { CommonService } from './common.service';


interface Item {
  imageSrc: string;
  imageAlt: string;
  uid: string;
  id: string;
  event_id: string;
  users_in_image: string[];
  // timestamp: Date;
}

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage {
  title = 'uers-location';
  // location: any;
  filterType: string = 'posts'; 
  event: Event;
  // location: Event;
  participants: any;
  private history: string[] = [];
  cards: any[] = []; // Array to store cards data
  // filterType: string = 'Ongoing';
  loading: boolean = true;
  errorMessage: string | undefined;
  events: any[] = []; // Array to store events data
  // participants: Participant[] = [
  //   { name: 'John' },
  //   { name: 'Thabo' },
  //   { name: 'Naria' },
  //   // Add more participant objects as needed
  // ];

  data: Item[] = [];
  // router: any;

  // constructor(private galleryDataService: GalleryDataService) {
  //   this.galleryDataService.setData(this.data);
  // }

  getStatusColor(status: string) {
    if (status === 'ongoing') {
      return 'success';
    } else if (status === 'upcoming') {
      return 'warning';
    } else {
      return 'danger';
    }
      }

  @ViewChild('eventTabs', { static: false }) tabs: IonTabs | undefined;
  selectedTab: any;
  // participants: never[];
  qrCodeImage: string | undefined;
  isGalleryOpen: boolean = false;
  // http: any;

  isMenuOpen = false; // Initialize menu as closed
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Toggle the menu state
  }
  

  restrictedWords_list: string[] = [];

  constructor(private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    // private currentEventDataService: CurrentEventDataService,
		private afAuth: AngularFireAuth,
    private location: Location,
    private galleryDataService: GalleryDataService,
    private afs: AngularFirestore,
    // private camera: Camera,
    private api: ApiService,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    public authService: AuthService,
    private userService: Service,
    // private commmonService:CommonService
    ) {
      // click the 
      this.url = "sdafsda";
    this.router.events.subscribe((event: any) => {
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
  url: string = window.location.href;
  posts: any;


  user_id:string ="";

  ngOnInit() {
    // click the element with id of posts_tab
    document.getElementById("posts_tab")?.click();

    this.url = "";
    // give messageCollection stub value
    // this.messagesCollection = this.afs.collection<Message>(`Event-Chats/0/chats`);
    this.activatedRoute.paramMap.subscribe((paramMap: any) => {
      if (!paramMap.has('id')) {
        // Redirect to home page if no event id is available
        this.navCtrl.navigateBack('/home');
        return;
      }


      // this.commmonService.getLocation().subscribe((response)=> 
      //   console.log(response)
      //   this.location = response;
      // )
      // participants: Participants[] = [
      //   { name: 'John' },
      //   { name: 'Thabo' },
      //   { name: 'Naria' },
        // Add more participant objects as needed
      // ];
     

      const event_id = paramMap.get('id');

      console.log(`The event id = ${event_id}`);
      this.messagesCollection = this.afs.collection<Message>(`Event-Chats/${event_id}/chats`);
      this.postsCollection = this.afs.collection<Item>(`Event-Posts/${event_id}/posts`);

      this.getCurrentUserId().subscribe((uid) => {
        if (uid) {
          this.user_id = uid;
          this.http.get(`${this.api.apiUrl}/e/events/${event_id}?uid=${uid}`).subscribe((data) => {
            this.url = `https://xpose-4f48c.web.app/view-event/${event_id}`;
            this.retrieveMessages();
            this.retrievePosts();
            this.current_event = data;
            this.loading = false;
            console.log(this.current_event); 
            this.getEventParticipantsFromAPI();
            console.log(this.participants);



            // Load restricted words
               // restricted words data
               this.addRestrictedWords(event_id, []);
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
      // // make api call to ${this.api.apiUrl}/e/events/{event_id}
      // this.http.get('${this.api.apiUrl}/e/events/' + event_id).subscribe((res : any) => {
      //   console.log(res);
      //   this.event = res;
      //   // this.currentEventDataService.event_id = res._id;
      // });
    });
  }
  // import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
  // import { HttpClient } from '@angular/common/http';
  
  // ...


  addRestrictedWords(event_id:string, tagWords: string[]) {
    this.computationOfRestrictedWords(event_id, tagWords).subscribe(
      (response: any) => {
        //
        console.log("Restricted words added:", response);

        this.restrictedWords_list = response.tagWords;
        console.log("Restricted words array:", this.restrictedWords_list);
      },
      (error) => {
        console.log("Error adding restricted words", error)
      }
    )
   }

    computationOfRestrictedWords(event_id: string, tagWordsArray: string[]) {      
      const formData:FormData = new FormData();
      let flag = false;
      for(let index = 0; index < tagWordsArray.length; index++) {
        flag = true;
        formData.append('restrictedWords[]',tagWordsArray[index].toLowerCase());
      }
      if(!flag){
        formData.append('restrictedWords[]', '');
      }
      
      return this.http.post(`${this.api.apiUrl}/c/chats/${event_id}/restrictedWord`, formData);
    }

  
  onLogoutClick() {
    this.getCurrentUserId().subscribe((uid) => {
      if (uid) {
        // Determine the user's event position (owner, participant, or others)

        switch (this.current_event.user_event_position) {
          case 'owner':
            // Call the function to delete the event
            console.log("delete event");
            // this.deleteEvent(uid);
            break;
          case 'participant':
            // Call the function to leave the event
            console.log("leave event");
            // this.leaveEvent(uid);
            break;
          default:
            // Redirect to the view-event page with the event ID
            // this.redirectToViewEvent();
            console.log("redirect to view event");
            break;
        };
      }
    });
  }

  logout() {
		this.authService.signOut();
	}
  deleteEvent() {
    // Implement the API call to delete the event here
    // Make a request to delete the event using this.current_event.code as the event ID
    // You can use the http.delete() method for this purpose
    // Example:

    this.getCurrentUserId().subscribe((uid) => {
      if(uid !== this.current_event.owner) {
        console.log("You are not the owner of this event");
        return;
      }

      this.http.delete(`${this.api.apiUrl}/e/events/${this.current_event.code}?uid=${uid}`).subscribe(
        (response) => {
          // Event deleted successfully, handle the response as needed
          // Redirect to the home page
          this.navCtrl.navigateBack('/home');
        },
        (error) => {
          console.error('Error deleting event:', error);
        }
      );
    });
  }

  transform(value: Date): string {
    if (!(value instanceof Date)) {
      return '';
    }

    const hours = value.getHours();
    const minutes = value.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour format to 12-hour format
    const formattedHours = hours % 12 || 12;

    // Add leading zeros to minutes if needed
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Create the formatted time string
    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

    return formattedTime;
  }

  leaveEvent() {
    // Implement the API call to leave the event here
    // Make a request to remove the current user from the participants list
    // Use this.current_event.code as the event ID and getCurrentUserId() to get the user's UID
    // Example:
    this.getCurrentUserId().subscribe((uid) => {
      if (uid) {
        this.http.delete(`${this.api.apiUrl}/e/events/${this.current_event.code}/remove?uid=${uid}`).subscribe(
          (response) => {
            // User successfully left the event, handle the response as needed
            // Redirect to the home page
            console.log("User successfully left the event");
            this.navCtrl.navigateBack('/home');
          },
          (error) => {
            console.error('Error leaving event:', error);
          }
        );
      }
    });
  }

  editEvent() {
    console.log('Edit event');
    console.log(this.current_event.code);
    this.router.navigate(['event', this.current_event.code, 'settings']);
  }
  
  retrievePosts() {
    if (this.postsCollection) {
      this.postsCollection.snapshotChanges().pipe().subscribe((data) => {
        // this.cards = [];
        // this.data = [];
        this.data.length = 0;
        data.forEach((doc) => {
          const post: any = doc.payload.doc.data();

          console.log(post);
          this.data.push({
            imageSrc: post.image_url,
            imageAlt: post.timestamp,
            uid: post.uid,
            // add document id
            // doc_id: ,
            id: doc.payload.doc.id,
            event_id: this.current_event.code,
            users_in_image: post.users_in_image,
            // timestamp: post.timestamp
          });
        });
        // console.log(this.cards);
      });
    }
  }

  async openImageGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt, // Allow the user to choose between the gallery and camera
    });
  
    if (image && image.webPath) {
      try {
        // Convert image to Blob
        const response = await fetch(image.webPath);
        const blobImage = await response.blob();
  
        // Create FormData and append the image Blob to it
        const formData = new FormData();
        formData.append('image', blobImage, 'image.jpg');
  
        // Send the FormData to the server
        this.getCurrentUserId().subscribe((uid) => {
          formData.append('user_id', uid);
          if (uid) {
            this.http.post(`${this.api.apiUrl}/posts/${this.current_event.code}?uid=${uid}`, formData).subscribe(
              (res: any) => {
                console.log(res);
              },
              (error: any) => {
                console.error(error);
              }
            );
          }
        });
      } catch (error) {
        console.error('Error while processing image:', error);
      }
    } else {
      console.log("No image data available.");
    }

    this.isGalleryOpen = true;
  }
  
  async openGalleryModal(imageSrc: string) {
    const modal = await this.modalController.create({
      component: GalleryModalComponent,
      componentProps: {
        selectedImage: imageSrc,
      },
    });
  
    await modal.present();
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
        const geocoder = new google.maps.Geocoder();

        this.http
          .get(`${this.api.apiUrl}/e/events/${this.current_event.code}/participants?uid=${uid}`)
          .subscribe((data) => {
            this.participants = data;

            // this.event.participants.forEach((participant: any) => {
            //   participant.since_joining = this.formatDateSinceJoining(participant.join_date);
            // });
            this.participants.forEach((participant:any) =>{
              this.userService.GetUser(participant.uid).subscribe(
                (user) => {
                  if(user) {
                    participant.photoURL = user.photoURL;
                    participant.uniq_username = user.uniq_username;
                    // TODO: Add validation on events service, so
                    if (true) {
                      this.http.get(`https://geocode.maps.co/reverse?lat=${user.location._lat}&lon=${user.location._long}`)
                      .subscribe((response: any) => {
                        participant.location = response.display_name;
                      });
                      // participant.location = user.location._lat + ', ' + user.location._long;
                    }
                    // participant.location
                    console.log(user);
                  }
                }
              )
            })

            console.log("Participants data:",data);
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
    console.log(participant.id);
    // this.router.navigateByUrl('/user-profile')
    // / Check if participant object and participant.id are defined and not null
    if (participant) {
      // Navigate to the user profile page with the participant's ID
      this.router.navigate(['/user-profile', participant.uid, this.user_id]);
    } else {
      // Handle the case where participant object or participant.id is invalid or missing
      console.error('Invalid participant data.');
      // Optionally, you can show an error message or handle the situation differently.
    }

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
  onPosts() {
    this.router.navigate(['../event/posts']);
  }

  onJoinedEvent() {
    this.router.navigate(['/joined-event']);
  }

  onHome() {
    this.router.navigate(['/home']);
  }

  closeGallery() {
    this.isGalleryOpen = false;
  }

  // Code to create and send messages
  newMessage!: string;

  // Check if there's a banned word
  containsRestrictedWord() {
    for (const word of this.restrictedWords_list) {
      if (this.newMessage.toLocaleLowerCase().includes(word.toLowerCase())) {
        return [true,word]
      }
    }
    return [false, ''];
  }

  openModalUser(content: any) {
    let modal = document.getElementById("myModal")
    let modalContent = document.getElementById("modalContent");
    if(modal) { 
      modal.style.display = "block";
    }
    if(modalContent) {
      modalContent.textContent = content;
    }

  }

  closeModalUser() {
    var modal = document.getElementById("myModal");
    if(modal) modal.style.display = "none";
  }

  
  createMessage() {
    // check if message has banned or restriced words
    const [containsRestricted, restrictedWord] = this.containsRestrictedWord();
    if(this.newMessage) {
      if(containsRestricted) {
        this.openModalUser('Can\'t send message with banned word(s):\n' + restrictedWord);
        return;
      } else{
        console.log("Message does not contain banned word");
      }
    }

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

        this.http.post(`${this.api.apiUrl}/c/chats/${event_id}?uid=${uid}`, formData).subscribe((res) => {
          console.log(res);
        });
      });
    }
  }
  
  postsCollection: AngularFirestoreCollection<Post> | undefined;
  messagesCollection: AngularFirestoreCollection<Message> | undefined;
  messages: Message[] = [];

  async retrieveMessages() {
    if(this.messagesCollection) {
      this.messagesCollection.valueChanges().subscribe((messages: Message[]) => {
        this.messages = messages;

        // Fetch and assign the displayName for each message
        this.messages.forEach((message: Message) => {
          this.getUserNameFromUid(message.uid).subscribe((displayName: string) => {
            message.displayName = displayName;
            // get the profile photo user who's messaged
            this.userService.GetUser(message.uid).subscribe(
              (user) => {
                if(user) {
                  message.photoURL = user.photoURL;
                }
              }
            )
          });
        });

        console.log(`The messages are before sorting: ${messages}`);
        console.log(this.messages);
        
        // sort the messages
        this.messages.sort((a: Message, b: Message) => {
          const timestampA = a.timestamp ? a.timestamp.toMillis() : 0;
          const timestampB = b.timestamp ? b.timestamp.toMillis() : 0;
          return timestampB - timestampA;
        });
        
        // this.messages.reverse();
        console.log(`The messages are after sorting: ${messages}`);
        console.log(this.messages);

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

  // getUser with specified ID

  // Code to handle participants

  addParticipant(participant: any) {
    // Handle participant addition logic here
  
    // For demonstration, we'll add the participant back to the event object's participants array
    // this.event.participants.push(participant);
    this.participants.push(participant);
  }

  removeParticipant(participant: any) {
    console.log(participant);
    
  }
  

  onSearchClick() {
    this.router.navigate(['/search-image']);
  }
//  ramdom
    // Function to generate the random avatar based on initials
    generateAvatar(photoURL: string | undefined): string {
      // const initials = this.getInitials(name);
      // const color = this.getRandomColor();
  
      // You can customize the avatar appearance (size, font size, background color) here
    //   const avatarUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Crect width='100' height='100' fill='${color}'/%3E%3Ctext x='50' y='55' font-size='48' fill='white' text-anchor='middle' dy='.3em' font-family='Arial, sans-serif'%3E${initials}%3C/text%3E%3C/svg%3E`;
      
    //   return this.sanitizer.bypassSecurityTrustResourceUrl(avatarUrl);
    // }
  
    // Function to get the initials from a name
    // console.log("Testing displayname", displayName);
    const defaultAvatarUrl = 'path/to/default/avatar.jpg';
    return photoURL ? photoURL : defaultAvatarUrl;
    }

    getInitials(name: string): string {
      const names = name.split(' ');
      let initials = '';
      for (const name of names) {
        initials += name.charAt(0);
      }
      return initials.toUpperCase();
    }
  
    // Function to generate random colors
    getRandomColor(): string {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    toDate(firebase_timestamp:  firebase.default.firestore.Timestamp | undefined) {
      if(firebase_timestamp !== undefined) {
       return firebase_timestamp.toDate();
      }
      return '';
    }

    getPlaceName(latitude: number, longitude: number): Observable<string> {
      const apiUrl = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`;
    
      return this.http.get(apiUrl).pipe(
        map((response: any) => {
          if (response && response.results && response.results.length > 0) {
            const place = response.results[0].formatted;
            return place;
          } else {
            return 'Unknown Location';
          }
        })
      );
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
  timestamp?: firebase.default.firestore.Timestamp;
  photoURL?:string;
}

interface Post {
  uid: string;
  imageSrc: string; // Add displayName property
  imageAlt: string;
  id?: string;
  timestamp?: Date;
}

