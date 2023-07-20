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

  joinAndRedirect() {
    if (this.isJoined) {
      return;
    }

    // Perform join event logic here

    this.isJoined = true;
  }
}
