import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.page.html',
  styleUrls: ['./view-event.page.scss'],
})
export class ViewEventPage implements OnInit {
  isJoined: boolean = false; // Add the isJoined property
  events: any;
  eventpost: any;

  constructor(private router: Router,
              private http: HttpClient
              ) { }
  ngOnInit() {
    this.getEventsFromAPI();
    this.postEventsFromAPI();
  }

  getEventsFromAPI() {
    this.http.get("http://localhost:8000/e/events/").subscribe((data) => {
      console.log(data);
      this.events = data;
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
