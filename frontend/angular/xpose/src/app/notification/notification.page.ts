import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  constructor(private router: Router) { }
  // constructor() { }

  ngOnInit() {
  }

  acceptRequest() {
    // Handle accept request logic here
  }

  rejectRequest() {
    // Handle reject request logic here
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
    this.router.navigate(['/join-event']);
    }
    onHome(){
      this.router.navigate(['/home']);
      }

}
