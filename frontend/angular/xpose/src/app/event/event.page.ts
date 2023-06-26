import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage {
  event: { title: string, date: string, location: string, description: string };

  @ViewChild('eventTabs', { static: false }) tabs: IonTabs | undefined;
  selectedTab: any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    // Mocked event data
    this.event = {
      title: 'Sample Event',
      date: 'June 30, 2023',
      location: 'Sample Location',
      description: 'This is a sample event description.'
    };
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
