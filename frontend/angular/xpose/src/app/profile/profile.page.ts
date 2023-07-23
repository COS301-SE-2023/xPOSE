import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../shared/services/auth.service";
import { Service } from '../service/service';

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
  selectedTab: any;
  tabs: any;

  constructor (
    private router: Router,
    public authService: AuthService,
    public userService: Service
  ) {
    this.user = {
      photoURL: './assets/images/profile picture.jpg',
      displayName: 'John Doe',
      email: 'johndoe@example.com',
    };
    this.user.photoURL = './assets/images/profile picture.jpg'; // Updated profile picture URL
  }

  ngOnInit(){
    this.authService.getCurrentUserId().subscribe((uid) => {
      if (uid) {
        this.userService.GetUser(uid).subscribe((userData) => {
          console.log("User name: ", userData.displayName);
          console.log("User email: ", userData.email);
          this.user.displayName = userData.displayName;
          this.user.email = userData.email;
          
        });
      }
      else {
        console.log("profile page no user id");
      }
    });
  }

  setCurrentTab() {
    this.selectedTab = this.tabs?.getSelected();
    console.log(this.selectedTab);
  }

  logout() {
    this.authService.signOut();
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
