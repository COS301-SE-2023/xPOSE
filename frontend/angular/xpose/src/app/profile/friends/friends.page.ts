import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  userFriends: any[] = [
    {
      name: 'Lucas Murphy',
      profilePicUrl: './assets/profiles/Lucas Murphy.jpg',
      location: 'New York'
    },
    {
      name: 'Jane Smith',
      profilePicUrl: 'assets/profiles/jane-smith.jpg',
      location: 'London'
    },

    {
      name: 'Jerry James',
      profilePicUrl: 'assets/profiles/jerry-james.jpg',
      location: 'South Africa'
    },
    // Add more mock friend objects as needed
  ];

  loading:boolean = true; // initial loading state

  constructor( 
    private http: HttpClient,
    private authService: AuthService) { }

  ngOnInit() {
    this.getFriends();
  }

  getFriends(){
    const endpoint = 'http://localhost:8000/u/users/';
    this.loading = true;

    this.http.get<any[]>(`${endpoint}${3434}/friends`).subscribe(
      (response) => {
        this.userFriends = response;
        this.loading = false;
      },
      (error) => {
        console.error("Error:", error);
      }
    );
  }

  unfriend(friend: any) {
    // Here you can implement the logic to remove the friend from your list
    // For demonstration purposes, I'll just remove the friend from the userFriends array directly
    const index = this.userFriends.indexOf(friend);
    if (index !== -1) {
      this.userFriends.splice(index, 1);
    }
  }
}
