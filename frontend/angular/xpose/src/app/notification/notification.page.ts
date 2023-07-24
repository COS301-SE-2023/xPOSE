import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { getFirestore, collection, query, onSnapshot, where } from "firebase/firestore";
import { NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';



@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  private history: string[] = [];
  title = 'notification??';
  messages: any[] = []; // Array to store message payloads
  constructor(private router: Router, private location: Location,) { 

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }
  // constructor() { }

  ngOnInit() {
    // this.requestPermission();
    this.listenForNotifications();
    // this.listen();
    this.loadMessages();
  }

  loadMessages() {
    const storedMessages = localStorage.getItem('messages');
    this.messages = storedMessages ? JSON.parse(storedMessages) : [];
  }

  listenForNotifications() {
    const db = getFirestore();
    const userId = 'your-user-id'; // Replace this with the user ID of the current user
    const notificationsCollection = collection(db, `Notifications/${userId}/MyNotifications`);

    const querySnapshotListener = onSnapshot(notificationsCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          // The 'data' variable will contain the notification data
          console.log("New notification received:", data);
          // You can add your logic to handle the new notification here
          // For example, update the messages array and save it in localStorage
          this.messages.push(data);
          this.saveMessages();
        }
      });
    });
  }

  saveMessages() {
    localStorage.setItem('messages', JSON.stringify(this.messages));
    // console.log('Messages saved to local storage');
  }

  clearMessages() {
    localStorage.removeItem('messages');
    this.messages = [];
    console.log('Messages cleared from local storage');
  }

  back(): void {
    this.history.pop();
    if (this.history.length >= 0) {
      this.location.back();
    } else {
      this.router.navigateByUrl("/home");
    }
  }
  
  
  // requestPermission() {
  //   const messaging = getMessaging();
  //   getToken(messaging, { vapidKey: environment.firebase.vapidKey}).then(
  //      (currentToken) => {
  //        if (currentToken) {
  //          console.log("Hurraaa!!! we got the token.....");
  //          console.log(currentToken);
  //        } else {
  //          console.log('No registration token available. Request permission to generate one.');
  //        }
  //    }).catch((err) => {
  //       console.log('An error occurred while retrieving token. ', err);
  //   });
  // }
  //
  // listen() {
  //   const messaging = getMessaging();
  //   onMessage(messaging, (payload) => {
  //     console.log('Message received. ', payload);
  //     this.messages.push(payload); // Save the payload in the messages array
  //     this.saveMessages();
  //
  //     // this.message=payload;
  //   });
  // }
  
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
