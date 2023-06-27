import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicModule, ModalController } from '@ionic/angular';
import { NgFor } from '@angular/common';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-send-friend-requests',
  templateUrl: './send-friend-requests.component.html',
  styleUrls: ['./send-friend-requests.component.scss'],
  standalone: true,
  imports: [IonicModule, NgFor]
})
export class SendFriendRequestsComponent implements OnInit {
  users: any[] = [];
  loading: boolean = true; // Initial loading state

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth
    ) {}

  ngOnInit() {
    this.getUsers();
  }
  getUsers() {
    const endpoint = 'http://localhost:8000/u/users';
    this.loading = true;

    this.http.get<any[]>(endpoint).subscribe(
      (response) => {
        this.users = response;
        this.loading = false;
        // console.log('Users:', this.users);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }


  sendFriendRequest(user: any) {
    this.getCurrentUserId().subscribe(
      (userId) => {
        if (userId) {
          const requestId = user.uid;
          const endpoint = `http://localhost:8000/u/users/${userId}/friend-requests/${requestId}`;
  
          console.log("My sender id is: " + userId);
          console.log("My recipient id is: " + requestId);
  
          this.http.post(endpoint, {}).subscribe(
            (response) => {
              console.log('Friend request sent successfully.');
            },
            (error) => {
              console.error('Error sending friend request:', error);
            }
          );
        } else {
          console.log('No user is currently logged in.');
        }
      }
    );
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
  



  // sendFriendRequest(user: any) {
  //   const userId = this.getCurrentUserId();
  //   const requestId = user.uid;

  //   const endpoint = `http://localhost:8000/u/users/${userId}/friend-requests/${requestId}`;

  //   console.log("My sender id is: "+ userId);
  //   this.http.post(endpoint, {}).subscribe(
  //     (response) => {
  //       console.log('Friend request sent successfully.');
  //     },
  //     (error) => {
  //       console.error('Error sending friend request:', error);
  //     }
  //   );
  // }


  // getCurrentUserId() {
  //   this.afAuth.authState.subscribe(user => {
  //     if (user) {
  //       const userId = user.uid;
  //       // console.log('Current user ID:', userId);
  //       return userId;
  //     } else {
  //       console.log('No user is currently logged in.');
  //       return null;
  //     }
  //   });
  // }
}
