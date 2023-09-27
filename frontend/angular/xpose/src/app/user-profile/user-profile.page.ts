import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { Service } from '../service/service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ApiService } from '../service/api.service';
import { ChangeDetectorRef } from '@angular/core';
import { error } from 'console';




@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})

export class UserProfilePage implements OnInit {
  // user: any; // Define your user object
  isDropdownOpen = false;
  userEvents: any[] | undefined;
  events: any[] = [];
  userFriends: any[] = [];
  loading:boolean = true;
  cards: any[] = [];
  selectedSegment: string = 'events';
  
  user: {
    photoURL: string;
    displayName: string;
    email: string;
    username: string;
    uid: string;
    visibility: string;
  };
  eventDate: string = ''; // Initialize with the event date
  eventLocation: string = ''; // Initialize with the event location
  uid_viewing_user: string ="";
  isFriend: boolean = false;
  requestSent: boolean = false;
  isPublic: boolean = true;
  selectedTab: any;
  tabs: any;
  selectedOption: string = '';
  private history: string[] = [];
  
  constructor (
    private router: Router,
    public authService: AuthService,
    public userService: Service,
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private firestore: AngularFirestore,
    private api: ApiService
    // private location: Location
  ) {
    this.user = {
      photoURL: '',
      displayName: 'loading...',
      email: 'loading...',
      username:'loading...',
      uid:"",
      visibility:""
    };
    this.user.photoURL = ''; 
  }
  // ngOnInit() {
  //    // 'event' should be the path to your "Event" page
  // }
  
   async ngOnInit() {
    
    try {
      let id = window.location.href;
      // Split the URL by slashes (/)
      const urlParts = id .split('/');
      // Get the last part of the URL, which should be the uid
      const uid = urlParts[urlParts.length - 2];
  
      // console.log("User being viewd:",uid);

      // console.log("UID:", uid); // Add this line for debugging
      this.uid_viewing_user = urlParts[urlParts.length - 1];
      // console.log("Viewing user",urlParts[urlParts.length - 1]);

      // console.log("UID Viewing User:", this.uid_viewing_user);
      this.user.uid = uid;


      // convert observable into promise
      const userDatPromise = new Promise<any>((resolve, reject) =>{
        this.userService.GetUser(uid).subscribe(
          (userData) => resolve(userData),
          (error) => reject(error)
        );
      });
  
  
      const userData = await userDatPromise;
      
      if(userData) {
        // console.log("User Data:", userData); // Log the user data for debugging
        this.user.displayName = userData.displayName;
        this.user.email = userData.email;
        this.user.username = userData.uniq_username;
        this.user.photoURL = userData.photoURL;
        this.user.visibility = userData.visibility; 
        // console.log("user testing visibility", this.user.visibility);

        await this.updateFriendShipStatus();  
        this.getEventsFromAPI();
        this.getfriends();
      }else {
        console.log("User not found");
      }
    } catch(error){
      console.log("Error in ngOnInt:", error)
    }

  }

  forceRedirect(friendUid: string, viewingUid: string) {
    const userProfileUrl = `/user-profile/${friendUid}/${viewingUid}`;
      // Update the window location to trigger a full page refresh
      window.location.href = userProfileUrl;
  }

  async updateFriendShipStatus() {

    try{
      // `${this.api.apiUrl}/u/users/`;
      const response = await this.http.get<{ areFriends: boolean }>(`${this.api.apiUrl}/u/users/${this.user.uid}/isFriend/${this.uid_viewing_user}`).toPromise();
      
      if(response?.areFriends){
        this.isFriend = true;
      } else {
        this.isFriend = false;
      }

      console.log("Update friend request testing", this.isFriend);

    } catch(error){
      console.error('Error updating friendship status:', error);
    }
  }

  handleFunction(user:any){

    if(this.isFriend){
      // unfriend users
      this.removeFriendRequest(user);
      this.isFriend = false;
    } else {
      // send friend request
      this.sendFriendRequest()
      this.requestSent = true;
    }
  }

  removeFriendRequest(user:any){
    const endpoint = `${this.api.apiUrl}/u/users/`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const requestBody = JSON.stringify(user);
    return this.http.post<any>(`${endpoint}${this.uid_viewing_user}/friend-requests/${this.user.uid}/reject`, requestBody, {headers})
    .toPromise()
    .then((response) => {
      console.log("Friend request rejected/removed",response);  
    })
    .catch((error) => {
      // Handle error response here
      console.log("Error:", error);
      // console.log("Response body:", error.error);
      return Promise.reject(error);
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Define functions to handle menu options
  showEvent() {
    // Implement what should happen when "Event" is clicked
    // For example, navigate to an event page
    this.isDropdownOpen = false;
  }

  showFriends() {
    // Implement what should happen when "Friends" is clicked
    // For example, navigate to a friends page
    this.isDropdownOpen = false;
  }

  showPhotos() {
    // Implement what should happen when "Photos" is clicked
    // For example, navigate to a photos page
    this.isDropdownOpen = false;
  }


  private checkVisibility(){
    if (this.user.visibility == "private" && this.isFriend == false){
      // cannot show events of private account
      this.isPublic = false;
    }

    if (this.user.visibility == "private" && this.isFriend === true){
      // can see events of private account of  because they are friends
      this.isPublic = true;
    }

    if (this.user.visibility == "public"){
      // can see events of public account
      this.isPublic = true;
    }

  }
  async getEventsFromAPI() {

    this.checkVisibility();
    // console.log("User visibility in events test 1:::", this.isPublic);
    // console.log("User visibility in events test 2:::", this.user.visibility);

    if(this.isPublic || this.isFriend){
      // this.getCurrentUserId().subscribe((uid) => {
        let uid = this.user.uid;
        if (uid) {
          // console.log(`We got that ${uid}`);
          this.http.get<Event[]>(`${this.api.apiUrl}/e/events?uid=${uid}&filter=participant`).subscribe((events: Event[]) => {
            // console.log(events);
            this.events = events;
            this.populateCards();
          });       
        } else {
          console.log("No user id");
        }
      // });
    }
  }

  sendFriendRequest() {
    this.authService.getCurrentUserId().subscribe(
      (userId) => {
        if (userId) {
          const requestId = this.user.uid;
          const endpoint = `${this.api.apiUrl}/u/users/${userId}/friend-requests/${requestId}`;
          
          // Get the sender's name from Firestore
          this.firestore.collection("Users").doc(userId).get().subscribe(
            (senderData) => {
              const senderName = senderData.get("displayName");
              console.log("Sender name: " + senderName);
  
              // HTTP POST request with the senderName included
              this.http.post(endpoint, { username: senderName }).subscribe(
                (response) => {
                  console.log(response);
                  console.log("Friendship request done successfully!");

                  // this.isFriend = true;
                  this.requestSent = true;

                },
                (error) => {
                  console.error('Error sending friend request:', error);
                }
              );
            },
            (error) => {
              console.log("Error fetching sender data:", error);
            }
          );
        } else {
          console.log('No user is currently logged in.');
        }
      }
    );
  }
  
  getCurrentUserId(): Observable<string> {
    return this.afAuth.authState.pipe(
      map((user) => {
        if (user) {
          return user.uid;
        } else {
          console.log('No user is currently logged in.');
          return '';
        }
      })
    );
  }

  populateCards() {
    if (this.events.length === 0) {
      this.cards = []; // Empty the cards list when there are no events
    } else {
      this.cards = this.events.map((event) => ({
        title: event.title,
        location: `${event.location}`,
        description: '' + event.description,
        button: "Join event",
        image_url: event.image_url,
        longitude: event.longitude,
        latitude: event.latitude,
        id: event.code,
        created_at: event.createdAt,
        start_date: event.start_date,
        end_date: event.end_date,
        status: event.status,
      }));
    }
  }

  eventDetails(event_id: string) {
		this.router.navigate(['/view-event', event_id]);
	}


  async getfriends() {
    this.checkVisibility();
    if(this.isPublic || this.isFriend) {
      const endpoint = `${this.api.apiUrl}/u/users/`;
      this.loading = true;
      this.http.get<any[]>(`${endpoint}${this.user.uid}/friends`).subscribe(
      (response) => {
        this.userFriends = response;
        this.loading = false;
        console.log("Friends",this.userFriends);
        console.log("userfirends lenght test::::::", this.userFriends.length);
        if (this.userFriends.length === undefined){
          this.userFriends = [];
        }
      },
        (error) => {
          console.error(error.error.message);
        }
      );
    }
    
  }

  setSelectedOption(option: string) {
    this.selectedOption = option;

    // Set event-related data when "Event" is selected
    if (option === 'Event') {
      this.eventDate = '2023-09-30'; // Replace with your event date
      this.eventLocation = 'Event Location'; // Replace with your event location
    } else {
      // Clear event-related data if a different option is selected
      this.eventDate = '';
      this.eventLocation = '';
    }
  }

  setCurrentTab() {
    this.selectedTab = this.tabs?.getSelected();
    console.log(this.selectedTab);
  }

  logout() {
    this.authService.signOut();
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

  editProfile() {
    // Add logic to navigate to the edit profile page
    this.router.navigate(['/edit-profile']);
  }

}
