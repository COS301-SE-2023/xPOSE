import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicModule, ModalController } from '@ionic/angular';
import {NgFor, NgIf} from '@angular/common';
import { AuthService } from "../shared/services/auth.service";
import { Service } from '../service/service';
import { error } from 'console';

@Component({
  selector: 'app-send-friend-requests',
  templateUrl: './send-friend-requests.component.html',
  styleUrls: ['./send-friend-requests.component.scss'],
  standalone: true,
    imports: [IonicModule, NgFor, NgIf]
})
export class SendFriendRequestsComponent implements OnInit {
  users: any[] = [];
  loading: boolean = true; // Initial loading state

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    public userService: Service
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
    this.authService.getCurrentUserId().subscribe(
      (userId) => {
        if (userId) {
          const requestId = user.uid;
          const endpoint = `http://localhost:8000/u/users/${userId}/friend-requests/${requestId}`;
  
          console.log("My sender id is: " + userId);
          console.log("My recipient id is: " + requestId);

          let senderName = "";
          // get name of sender
          this.userService.GetUser(userId).subscribe(
            (senderData) => {
              console.log("Sender name: "+ senderData.displayName);
              senderName = senderData.displayName;
            },
            (error) => {
              console.log("Error fetching sender name:", error);
            }
          );
          
          // console.log("?????: "+ senderName);

          this.http.post(endpoint, {username:`${senderName}`}).subscribe(
            (response) => {
              console.log(response);
              console.log(response);
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
  
}
