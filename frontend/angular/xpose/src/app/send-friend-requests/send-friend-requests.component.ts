import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicModule, ModalController } from '@ionic/angular';
import {NgFor, NgIf} from '@angular/common';
import { AuthService } from "../shared/services/auth.service";
import { Service } from '../service/service';
import { AngularFirestore } from "@angular/fire/compat/firestore";

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
    public userService: Service,
    private firestore: AngularFirestore
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
  
          // console.log("My sender id is: " + userId);
          // console.log("My recipient id is: " + requestId);
  
          // Get the sender's name from Firestore
          this.firestore.collection("Users").doc(userId).get().subscribe(
            (senderData) => {
              const senderName = senderData.get("displayName");
              console.log("Sender name: " + senderName);
  
              // HTTP POST request with the senderName included
              this.http.post(endpoint, { username: senderName }).subscribe(
                (response) => {
                  console.log(response);
                },
                (error) => {
                  console.error('Error sending friend request:', error);
                }
              );
            },
            (error) => {
              console.log("Error fetching sender data:", error);
            }
          );
        } else {
          console.log('No user is currently logged in.');
        }
      }
    );
  }
  
  
}