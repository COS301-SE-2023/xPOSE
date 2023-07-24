import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable } from 'rxjs';



@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  title = 'notification??';
  messages: any[] = []; // Array to store message payloads

  constructor(private router: Router,
    private firestore: AngularFirestore) {}
  // constructor() { }

  ngOnInit() {
    // this.requestPermission();
    this.listenForNotifications();
  }

  loadMessages() {
    const storedMessages = localStorage.getItem('messages');
    this.messages = storedMessages ? JSON.parse(storedMessages) : [];
  }

  listenForNotifications() {

    // console.log("Testing  1=========");
    const userId = '1234';

    // console.log("Testing 2=============");
    const notificationsCollection = this.firestore.firestore.collection(`Notifications/${userId}/MyNotifications`).where('status', '==', 'pending');

    console.log("Testing 1=============");
    // add listener
    notificationsCollection.onSnapshot(
      (snapshot) => {
        console.log("Testing 2=============");
        snapshot.forEach((doc) =>{
          const notificationData = doc.data();
          console.log("Notification:", notificationData);
        });
      }, 

      (error) => {
        console.error("Error listyening for notification:", error);
      }
    )

    // console.log("Testing collection:", notificationsCollection);
    
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
