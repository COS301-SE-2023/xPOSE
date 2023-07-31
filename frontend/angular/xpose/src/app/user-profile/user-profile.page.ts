import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { Service } from '../service/service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
  };
  selectedTab: any;
  tabs: any;
  private history: string[] = [];

  constructor (
    private router: Router,
    public authService: AuthService,
    public userService: Service,
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    // private location: Location
  ) {
    this.user = {
      photoURL: './assets/images/profile picture.jpg',
      displayName: 'John Doe',
      email: 'johndoe@example.com',
    };
    this.user.photoURL = './assets/images/profile picture.jpg'; // Updated profile picture URL
  }

  ngOnInit() {
    
    this.authService.getCurrentUserId().subscribe((uid) => {
      if (uid) {
        this.userService.GetUser(uid).subscribe((userData) => {
          console.log("User name: ", userData.displayName);
          console.log("User email: ", userData.email);
          this.user.displayName = userData.displayName;
          this.user.email = userData.email;
          
        });
      }
      else {
        console.log("profile page no user id");
      }
    });

    this.getEventsFromAPI();
  }

  getEventsFromAPI() {
    this.getCurrentUserId().subscribe((uid) => {
      if (uid) {
        console.log(`We got that ${uid}`);
        this.http.get<Event[]>(`http://localhost:8000/e/events?uid=${uid}&filter=participant`).subscribe((events: Event[]) => {
          console.log(events);
          this.events = events;
          this.populateCards();
        });       
      } else {
        console.log("No user id");
      }
    });
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
