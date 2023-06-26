import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {getMessaging, getToken, onMessage} from "firebase/messaging";
import { environment } from "../../environments/environment";


// import { AngularFirestoreModule } from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  title = 'notification??';
  message:any = null;
  constructor(private router: Router) { }
  // constructor() { }

  ngOnInit() {
    this.requestPermission();
    this.listen();
  }

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.firebase.vapidKey}).then(
       (currentToken) => {
         if (currentToken) {
           console.log("Hurraaa!!! we got the token.....");
           console.log(currentToken);
         } else {
           console.log('No registration token available. Request permission to generate one.');
         }
     }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
  }

  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message=payload;
    });
  }
  
  acceptRequest() {
    // Handle accept request logic here
  }

  rejectRequest() {
    // Handle reject request logic here
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

  rejectInvitation() {
    // Handle reject invitation logic here
  }

  acceptInvitation() {
    // Handle accept invitation logic here
  }

  viewReport() {
    // Handle view report logic here
  }
}
