import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  userEvents: any[] | undefined; // Define the userEvents property as an array to hold event data
  events: any[] = [];
  cards: any[] = [];

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit() {
    // Populate the userEvents array with event data
    // this.userEvents = [
    //   { name: 'Event 1', description: 'Description 1' },
    //   { name: 'Event 2', description: 'Description 2' },
    //   // Add more events as needed
    // ];

    this.getEventsFromAPI();
  }

  // onCardButtonClick(eventId: string) {
  //   this.router.navigate(['../view-event'], { queryParams: { id: eventId } });
  // }

  getEventsFromAPI() {
    this.getCurrentUserId().subscribe((uid) => {
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
    });
  }

  eventDetails(event_id: string) {
		this.router.navigate(['/view-event', event_id]);
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
}
