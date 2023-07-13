import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  username: string;
  email: string;

  constructor(
    private router: Router,
    public authService: AuthService
  ) {
    this.email = ''; 
    this. username= '';
   }
  saveProfile() {
    // Add logic to save the updated profile
    const updatedProfile = {
      username: this.username,
      email: this.email,
      
    };
    // Call a service method to update the profile
    

    // Navigate back to the profile page after saving
    this.router.navigate(['/profile']);
  } 

  ngOnInit() {
  }

}
