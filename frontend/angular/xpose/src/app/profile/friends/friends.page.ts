import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  userFriends: any[] = [];
  loading:boolean = true; // initial loading state
  currentUserId: string = "";
  constructor( 
    private http: HttpClient,
    private authService: AuthService,
    private api: ApiService) { }

  ngOnInit() {
    this.authService.getCurrentUserId().subscribe((uid) => {
      if (uid) {
        this.getFriends(uid);
        this.currentUserId = uid;
      }
      else {
        console.log("profile page no user id");
      }
    });


  }

  getFriends(uid:string){
    const endpoint = `${this.api.apiUrl}/u/users/`;
    this.loading = true;

    this.http.get<any[]>(`${endpoint}${uid}/friends`).subscribe(
      (response) => {
        this.userFriends = response;
        this.loading = false;

        console.log("Friends",this.userFriends);
        if (this.userFriends.length === undefined){
          this.userFriends = [];
        }
      },
      (error) => {
        console.error(error.error.message);
      }
    );
  }

  unfriend(user: any) {
    // Here you can implement the logic to remove the friend from your list
    // For demonstration purposes, I'll just remove the friend from the userFriends array directly
    const endpoint = `${this.api.apiUrl}/u/users/`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    console.log("FriendA id", user.uid);
    console.log("FriendB id", this.currentUserId);

    const requestBody = JSON.stringify(user);
    return this.http.delete<any>(`${endpoint}${this.currentUserId}/friends/${user.uid}`)
    .toPromise()
    .then((response) => {
      console.log("Friend removed",response);
      const index = this.userFriends.indexOf(user);
      if (index !== -1) {
        this.userFriends.splice(index, 1);
      }  
    })
    .catch((error) => {
      // Handle error response here
      console.log("Error:", error);
      // console.log("Response body:", error.error);
      return Promise.reject(error);
    });

  }
}
