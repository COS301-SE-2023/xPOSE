import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Service } from '../service/service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  user: any;
  areFriends: boolean;

  constructor(
    private route: ActivatedRoute,
    private service: Service
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    this.getUserData(userId);
  }

  getUserData(userId: string) {
    this.service.getUser(userId).subscribe((userData) => {
      this.user = userData;
      this.checkIfFriends(userId);
    });
  }

  checkIfFriends(userId: string) {
    const currentUserId = 'currentUserId'; // Replace 'currentUserId' with the ID of the currently logged-in user
    this.areFriends = this.areUsersFriends(currentUserId, userId);
  }

  unfriend() {
    const currentUserId = 'currentUserId'; // Replace 'currentUserId' with the ID of the currently logged-in user
    this.service.unfriendUser(currentUserId, this.user.id).subscribe(
      () => {
        this.areFriends = false;
      },
      (error) => {
        console.error('Error unfriending the user:', error);
      }
    );
  }

  areUsersFriends(currentUserId: string, otherUserId: string): boolean {
    // Implement your logic to check if the users are friends and return the result
    // For example, you could check if both users are in each other's friend list
    return true; // Replace this with your actual logic
  }
}
