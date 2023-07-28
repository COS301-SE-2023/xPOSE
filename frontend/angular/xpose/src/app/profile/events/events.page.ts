import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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
    private afAuth: AngularFireAuth
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

  getEventsFromAPI() {
    this.getCurrentUserId().subscribe((uid) => {
      if (uid) {
        console.log(`We got that ${uid}`);
        this.http.get<Event[]>(`http://localhost:8000/e/events?uid=${uid}&filter=participant`).subscribe((events: Event[]) => {
          console.log(events);
          this.events = events;
          this.populateCards();
          // this.events.filter((event) => event.status === 'ongoing');
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
        location: `(${event.latitude}, ${event.longitude})`,
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
}
