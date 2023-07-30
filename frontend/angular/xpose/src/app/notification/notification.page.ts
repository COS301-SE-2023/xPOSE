import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  private history: string[] = [];
  title = 'notification??';
  messages: any[] = []; // Array to store message payloads
  constructor(private router: Router,
     private location: Location,
     private firestore: AngularFirestore,
     public authService: AuthService) { 

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    this.listenForNotifications();
    this.loadMessages();
  }

  loadMessages() {
    const storedMessages = localStorage.getItem('messages');
    this.messages = storedMessages ? JSON.parse(storedMessages) : [];
  }

  listenForNotifications() {
    this.authService.getCurrentUserId().subscribe((userId) => {
      if (userId) {

        const notificationsCollection = this.firestore.firestore.collection(`Notifications/${userId}/MyNotifications`).where('status', '==', 'pending');
        // add listener
        notificationsCollection.onSnapshot(
          (snapshot) => {
   
           this.messages = [];
   
            snapshot.forEach((doc) =>{
              const notificationData = doc.data();
              this.messages.push(notificationData);
            });
   
            // sort in descending order
            this.messages.sort((a, b) => b.timestamp - a.timestamp);
            this.saveMessages();
          }, 
    
          (error) => {
            console.error("Error listening for notification:", error);
          }
        )

      }
      else {
        console.log("profile page no user id");
      }
    });
  }

  saveMessages() {
    localStorage.setItem('messages', JSON.stringify(this.messages));
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
      this.router.navigate(['/home']);
    }
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
