import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  acceptRequest() {
    // Handle accept request logic here
  }

  rejectRequest() {
    // Handle reject request logic here
  }

}
