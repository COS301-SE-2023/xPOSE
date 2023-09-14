import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss'],
})
export class FriendListComponent  implements OnInit {
  loading:boolean = true; // initial loading state
  currentUserId: string = "";
  friends = [
    {
      uid: "",
      displayName: '...',
      email: '...',
      uniq_username :"...",
      photoURL: 'https://via.placeholder.com/150',
    }
  ];

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
        this.friends = response;
        this.loading = false;

        console.log("Friends",this.friends);
        if (this.friends.length === undefined){
          this.friends = [];
        }
      },
      (error) => {
        console.error(error.error.message);
      }
    );
  }

  forceRedirect(friendUid: string) {
    const userProfileUrl = `/user-profile/${friendUid}/${this.currentUserId}`;
      // Update the window location to trigger a full page refresh
      window.location.href = userProfileUrl;
  }

  unfriend(user:any){
    const endpoint = `${this.api.apiUrl}/u/users/`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    console.log("FriendA id", user.uid);
    console.log("FriendB id", this.currentUserId);

    const requestBody = JSON.stringify(user);
    return this.http.delete<any>(`${endpoint}${this.currentUserId}/friends/${user.uid}`)
    .toPromise()
    .then((response) => {
      console.log("Friend removed",response);
      const index = this.friends.indexOf(user);
      if (index !== -1) {
        this.friends.splice(index, 1);
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
