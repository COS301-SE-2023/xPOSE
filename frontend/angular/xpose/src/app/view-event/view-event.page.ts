import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
// import { Loader } from '@googlemaps/js-api-loader';


@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.page.html',
  styleUrls: ['./view-event.page.scss'],
})
export class ViewEventPage implements OnInit, AfterViewInit {
  isJoined: boolean = false; // Add the isJoined property
  eventpost: any;
  event_id: any;
  event: any;

  constructor(private router: Router,
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
    // this.postEventsFromAPI();
  }
  

  getEventDataFromAPI() {
    this.getCurrentUserId().subscribe((uid) => {
      if (uid) {
        this.http.get(`http://localhost:8000/e/events/${this.event_id}?uid=${uid}`).subscribe((data) => {
          this.event = data;
          console.log(data); 
        });
      }
      else {
        console.log("no user id");
      }
    });

  }

  postEventsFromAPI() {
    let body = {
      eventCode:"2EFXE7",
        eventCreator:"yb6gGaZNj9SKGsYKrCkeDPVA5JA3",
        eventDescription:"Venue: Sheraton Hotel",
        eventEndDate: {_seconds: 1689292800, _nanoseconds: 0},

            }

    this.http.post("http://localhost:8000/e/events/", body).subscribe((data) => {
      console.log(data);
      this.eventpost = data;
    });
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

    ngAfterViewInit() {
      this.initMap();
    }
  
    initAutcomplete() {
      const input = document.getElementById('locationInput') as HTMLInputElement;
      const autocomplete = new google.maps.places.Autocomplete(input);
      
    }

    initMap() {
      console.log('Loading map');
      const mapContainer = document.getElementById('map');
      console.log(`map container ${mapContainer}`);
      
      if (mapContainer instanceof HTMLElement) {
        console.log(`Loading map`);
        const mapOptions: google.maps.MapOptions = {
          center: { lat: parseFloat(this.event.latitude), lng: parseFloat(this.event.longitude) },
          zoom: 14,
        };
        
        console.log(`Attributes showing ${this.event.latitude} ${this.event.longitude}`);
        this.map = new google.maps.Map(mapContainer, mapOptions);
        
        console.log(`Map loaded`);
        this.marker = new google.maps.Marker({
          position: { lat: parseFloat(this.event.latitude), lng: parseFloat(this.event.longitude) },
          map: this.map,
          title: 'Event Location',
        });
        console.log(`Marker loaded`);
      } else {
        console.error('Map container element not found');
      }
    }
    

  populateCards() {
    throw new Error('Method not implemented.');
  }

  joinAndRedirect() {
    const joinButton = document.getElementById('join-button');
    if (joinButton?.classList.contains('joined')) {
      return;
    }

    if (joinButton) {
      joinButton.innerText = 'Joined';
      joinButton.classList.add('joined');
    }

    // Redirect to the home page
    this.router.navigate(['/home']);
  }

}
