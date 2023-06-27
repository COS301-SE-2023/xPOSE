import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage {
  event: Event;

  @ViewChild('eventTabs', { static: false }) tabs: IonTabs | undefined;
  selectedTab: any;
  // http: any;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, private navCtrl: NavController) {
    // Mocked event data
    // this.event = {
    //   title: 'Sample Event',
    //   date: 'June 30, 2023',
    //   location: 'Sample Location',
    //   description: 'This is a sample event description.'
    // };

    this.event = {
      eventName: '',
      eventDescription: '',
      eventLocation: '',
      eventCreator: '',
      eventStartDate: new Date(),
      eventEndDate: new Date(),
      imageUrl: '',
      eventPrivacySetting: '',
      eventCode: ''
    }
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        // Redirect to home page if no event id is available
        this.navCtrl.navigateBack('/home');
        return;
      }

      // Fetch event data based on the route parameter
      const eventId = paramMap.get('id');
      // Call API or perform necessary logic to fetch event details
      // Assign the fetched data to this.event
      console.log(eventId);

      // make api call to http://localhost:8000/e/events/{eventId}
      this.http.get('http://localhost:8000/e/events/' + eventId).subscribe((res : any) => {
        console.log(res);
        this.event = res;
      });
    });
  }

  ionViewWillEnter() {
    // Fetch event data based on the route parameter
    const eventId = this.activatedRoute.snapshot.paramMap.get('id');
    // Call API or perform necessary logic to fetch event details
    // Assign the fetched data to this.event
    
  }

  setCurrentTab() {
    this.selectedTab = this.tabs?.getSelected();
    console.log(this.selectedTab);
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
}

interface Event {
  eventName: string;
  eventDescription: string;
  eventLocation: string;
  eventCreator: string;
  eventStartDate: Date;
  eventEndDate: Date;
  imageUrl: string;
  eventPrivacySetting: string;
  eventCode: string;
}
