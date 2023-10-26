import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Location } from '@angular/common';
import { ApiService } from '../service/api.service';

import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.page.html',
  styleUrls: ['./view-event.page.scss'],
})
export class ViewEventPage implements OnInit, AfterViewInit {
  isJoined: boolean = false;
  loading: boolean = true;
  eventpost: any;
  event_id: any;
  event: any = {}; // Initialize the event object with an empty object

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private location: Location,
    private api: ApiService,
    public authService: AuthService

  ) {
    this.map = null;
    this.marker = null;
  }

  map: google.maps.Map | null;
  marker: google.maps.Marker | null;

  ngOnInit() {
    this.event_id = this.route.snapshot.paramMap.get('id');
    console.log(this.event_id);
    this.getEventDataFromAPI();
    this.getEventParticipantsFromAPI();
  }

  goBack(): void {
    this.location.back();
  }

  getStatusColor(status: string) {
    if (status === 'ongoing') {
      return 'success';
    } else if (status === 'upcoming') {
      return 'warning';
    } else {
      return 'danger';
    }
      }

  // getEventDataFromAPI() {
  //   this.getCurrentUserId().subscribe((uid) => {
  //     if (uid) {
  //       this.http
  //         .get(`${this.api.apiUrl}/e/events/${this.event_id}?uid=${uid}`)
  //         .subscribe((data) => {
  //           this.event = data;

            
            

  //           console.log(data);
  //           // Call initMap() after the event object has been fetched and contains the required properties.
  //           this.initMap();
  //         });
          
  //     } else {
  //       console.log('no user id');
  //     }
  //   });
  // }
  getEventParticipantsFromAPI() {
    this.getCurrentUserId().subscribe((uid) => {
      if(uid) {
        this.http
          .get(`${this.api.apiUrl}/e/events/${this.event_id}/participants?uid=${uid}`)
          .subscribe((data) => {
            this.event.participants = data;

            // this.event.participants.forEach((participant: any) => {
            //   participant.since_joining = this.formatDateSinceJoining(participant.join_date);
            // });

            console.log(data);
          });
      }
    });
  }

  logout() {
		this.authService.signOut();
	}
  
  getEventDataFromAPI() {
    this.getCurrentUserId().subscribe((uid) => {
      if (uid) {
        this.current_user = uid;
        this.http
          .get(`${this.api.apiUrl}/e/events/${this.event_id}?uid=${uid}`)
          .subscribe((data) => {
            this.event = data;
            this.loading = false;
  
            // // Dummy participant data for demonstration purposes
            // this.event.participants = [
            //   {
            //     username: 'participant1',
            //     name: 'Participant One',
            //     description: 'Participant 1 description.',
            //   },
            //   {
            //     username: 'participant2',
            //     name: 'Participant Two',
            //     description: 'Participant 2 description.',
            //   },
            //   {
            //     username: 'participant3',
            //     name: 'Participant Three',
            //     description: 'Participant 3 description.',
            //   },
            // ];
  
            console.log(data);
            this.initMap();
          });
      } else {
        console.log('no user id');
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
          return 'guest';
        }
      })
    );
  }

  ngAfterViewInit() {
    // Don't call initMap() here, it should be called after the event data has been fetched in getEventDataFromAPI().
    // this.initMap();
  }

  initMap() {
    console.log('Loading map');
    const mapContainer = document.getElementById('map');
    console.log(`map container ${mapContainer}`);

    if (mapContainer instanceof HTMLElement) {
      console.log(`Loading map`);
      const mapOptions: google.maps.MapOptions = {
        center: {
          lat: parseFloat(this.event?.latitude),
          lng: parseFloat(this.event?.longitude),
        },
        zoom: 14,
      };

      console.log(
        `Attributes showing ${this.event?.latitude} ${this.event?.longitude}`
      );
      this.map = new google.maps.Map(mapContainer, mapOptions);

      console.log(`Map loaded`);
      this.marker = new google.maps.Marker({
        position: {
          lat: parseFloat(this.event?.latitude),
          lng: parseFloat(this.event?.longitude),
        },
        map: this.map,
        title: 'Event Location',
      });
      console.log(`Marker loaded`);
    } else {
      console.error('Map container element not found');
    }
  }

  // Function to handle the button click based on the user_event_position
  handleButtonClick() {
    switch (this.event?.user_event_position) {
      case 'owner':
      case 'participant':
        this.router.navigate(['/event', this.event.code]);
        break;
      case 'invited':
        this.acceptInvite();
        break;
      case 'requested':
        // No action required for "Requested" state, button is already disabled.
        break;
      case 'none':
        console.log('Will join or request');
        if (this.event?.privacy_setting === 'public') {
          if (this.current_user === "guest") {
            this.router.navigate(['/event', this.event.code]);
            return;
          }
          this.joinPublicEvent();
        } else {
          if (this.current_user === "guest") {
            // TODO: Redirect to login page
            this.router.navigate(['/login']);
            return;
          }
          this.requestPrivateEvent();
        }
        break;
      default:
        break;
    }
  }

    // Function to get the button label based on the user_event_position
    getButtonLabel(): string {
      switch (this.event?.user_event_position) {
        case 'owner':
        case 'participant':
          return 'View event';
        case 'invited':
          return 'Accept Invite';
        case 'requested':
          return 'Requested';
        case 'none':
          if (this.event?.privacy_setting === 'public') {
            return this.current_user === "guest" ? 'View event' : 'Join event';
          }
          return this.current_user === "guest" ? 'Sign up to request' : 'Request';
        default:
          return '';
      }
    }
    
    current_user: string = "";
  
    // Function to accept the invite (Replace this with your actual API call)
    acceptInvite() {
      // Make the API call to accept the invite here
      console.log('Accepting invite...');
      this.getCurrentUserId().subscribe((uid) => {
        if (uid) {
          const formData = new FormData();
          formData.append('response', 'accepted'); // will make this dynamic
          this.http
            .put(`${this.api.apiUrl}/e/events/${this.event_id}/invite?uid=${uid}`, formData)
            .subscribe((data) => {
              console.log(data);
              this.router.navigate(['/event', this.event.code]);
            });
        } else {
          console.log('no user id');
        }
      });
    }
  
    // Function to join a public event (Replace this with your actual API call)
    joinPublicEvent() {
      // Make the API call to join the public event here
      
      console.log('Joining public event...');
      this.getCurrentUserId().subscribe((uid) => {
        if (uid) {
          const formData = new FormData();
          formData.append('response', 'accepted'); // will make this dynamic
          this.http
            .post(`${this.api.apiUrl}/e/events/${this.event_id}/join?uid=${uid}`, formData)
            .subscribe((data) => {
              console.log(data);
              this.router.navigate(['/event', this.event.code]);
            });
        }
      });
    }
  
    // Function to request to join a private event (Replace this with your actual API call)
    requestPrivateEvent() {
      // Make the API call to request to join the private event here
      console.log('Requesting to join private event...');
      this.getCurrentUserId().subscribe((uid) => {
        if(uid) {
          const formData = new FormData();
          formData.append('response', 'accepted'); // will make this dynamic
          this.http
            .post(`${this.api.apiUrl}/e/events/${this.event_id}/request?uid=${uid}`, formData)
            .subscribe((data) => {
              // change the button label to "Request Sent"
              console.log(data);
              console.log('Request sent');
            });
        }
      });
    }

  joinAndRedirect() {
    if (this.isJoined) {
      return;
    }

    // Perform join event logic here

    this.isJoined = true;
  }
  removeParticipant(participant: any) {
    // Handle participant removal logic here
  
    // For demonstration, we'll remove the participant from the event object's participants array
    this.event.participants = this.event.participants.filter((p: any) => p !== participant);
  }
  
  addParticipant(participant: any) {
    // Handle participant addition logic here
  
    // For demonstration, we'll add the participant back to the event object's participants array
    this.event.participants.push(participant);
  }
  // participantDetails(participant: any)
  
  onCardClick(participant: any) {
    // Handle card click logic here
    // console.log('Card clicked');
    // console.log(participant);
    this.router.navigateByUrl('/user-profile')
    // this.router.navigate(['/participant', participant.id]);

  }

  
  ////////////////footer//////////////////////
  search() {
		this.router.navigateByUrl('/search');
	}
	viewEvent() {
		this.router.navigate(['/event']);
	}
	eventDetails(event_id: string) {
		this.router.navigate(['/view-event', event_id]);
	}
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