import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.page.html',
  styleUrls: ['./view-event.page.scss'],
})
export class ViewEventPage implements OnInit, AfterViewInit {
  isJoined: boolean = false;
  eventpost: any;
  event_id: any;
  event: any = {}; // Initialize the event object with an empty object

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private afAuth: AngularFireAuth
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
  }

  getEventDataFromAPI() {
    this.getCurrentUserId().subscribe((uid) => {
      if (uid) {
        this.http
          .get(`http://localhost:8000/e/events/${this.event_id}?uid=${uid}`)
          .subscribe((data) => {
            this.event = data;
            console.log(data);
            // Call initMap() after the event object has been fetched and contains the required properties.
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
          return '';
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
          this.joinPublicEvent();
        } else {
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
          return this.event?.privacy_setting === 'public' ? 'Join' : 'Request';
        default:
          return '';
      }
    }
  
    // Function to accept the invite (Replace this with your actual API call)
    acceptInvite() {
      // Make the API call to accept the invite here
      console.log('Accepting invite...');
      this.getCurrentUserId().subscribe((uid) => {
        if (uid) {
          const formData = new FormData();
          formData.append('response', 'accepted'); // will make this dynamic
          this.http
            .put(`http://localhost:8000/e/events/${this.event_id}/invite?uid=${uid}`, formData)
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
            .post(`http://localhost:8000/e/events/${this.event_id}/join?uid=${uid}`, formData)
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
            .post(`http://localhost:8000/e/events/${this.event_id}/request?uid=${uid}`, formData)
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

  
}
