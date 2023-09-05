import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { Service } from '../service/service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  userEvents: any[] | undefined;
  events: any[] = [];
  cards: any[] = [];
  selectedSegment: string = 'events';
  user: {
    photoURL: string;
    displayName: string;
    email: string;
    username: string;
    uid: string;
  };
  
  uid_viewing_user: string ="";
  isFriend: boolean = false;
  requestSent: boolean = false;
  selectedTab: any;
  tabs: any;
  private history: string[] = [];


  constructor (
    private router: Router,
    public authService: AuthService,
    public userService: Service,
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private firestore: AngularFirestore,
    private api: ApiService,
    // private location: Location
  ) {
    this.user = {
      photoURL: '',
      displayName: 'loading...',
      email: 'loading...',
      username:'loading...',
      uid:""
    };
    this.user.photoURL = './assets/images/profile picture.jpg'; // Updated profile picture URL
  }

  ngOnInit() {
    // this.isFriend = true;
    //  this.requestSent = true;
    let id = window.location.href;
    // Split the URL by slashes (/)
    const urlParts = id .split('/');
    // Get the last part of the URL, which should be the uid
    const uid = urlParts[urlParts.length - 2];

    // console.log("User being viewd:",uid);
    this.uid_viewing_user = urlParts[urlParts.length - 1];
    // console.log("Viewing user",urlParts[urlParts.length - 1]);

    this.user.uid = uid;
    this.userService.GetUser(uid).subscribe((userData) => {
      this.user.displayName = userData.displayName;
      this.user.email = userData.email;
      this.user.username = userData.uniq_username;
      this.user.photoURL =userData.photoURL;
      
      this.updateFriendShipStatus();
      
    });

    this.getEventsFromAPI();
  }


  async updateFriendShipStatus(){

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

  getEventsFromAPI() {
    // this.getCurrentUserId().subscribe((uid) => {
      let uid = this.user.uid;
      if (uid) {
        console.log(`We got that ${uid}`);
        this.http.get<Event[]>(`${this.api.apiUrl}/e/events?uid=${uid}&filter=participant`).subscribe((events: Event[]) => {
          console.log(events);
          this.events = events;
          this.populateCards();
        });       
      } else {
        console.log("No user id");
      }
    // });
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
        id: event.id,
        created_at: event.createdAt,
        start_date: event.start_date,
        end_date: event.end_date,
        status: event.status,
      }));
    }
  }

  // back(): void {
  //   this.history.pop();
  //   if (this.history.length >= 0) {
  //     this.location.back();
  //   } else {
  //     this.router.navigate(['/home']);
  //   }
  // }

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
