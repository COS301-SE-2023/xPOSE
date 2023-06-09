// profile.page.ts

import { Component } from '@angular/core';

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

  constructor() {
    this.user = {
      photoURL: 'avatar.jpg',
      displayName: 'John Doe',
      email: 'johndoe@example.com',
    };
  }

  logout() {
    // Add your logout logic here
  }
}
