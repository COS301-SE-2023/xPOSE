import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage {
  user: {
    photoURL: string;
    displayName: string;
    email: string;
  };

  constructor(private router: Router) {
    this.user = {
      photoURL: 'avatar.jpg',
      displayName: 'John Doe',
      email: 'johndoe@example.com',
    };
    this.user.photoURL = '/.assets/images/youth.jpg';
  }

  logout() {
    // Add your logout logic here
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
  editProfile() {
    // Add logic to navigate to the edit profile page
    this.router.navigate(['/edit-profile']);
  }
}
