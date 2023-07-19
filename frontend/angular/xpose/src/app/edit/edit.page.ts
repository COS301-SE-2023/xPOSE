import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  photoURL: string;
  username: string;
  email: string;

  constructor(
    public router: Router,
    public authService: AuthService
  ) {
    this.photoURL= './assets/images/profile picture.jpg';
    this.email = 'johndoe@example.com'; 
    this. username= 'John Doe';
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

  ngOnInit() {}

  onFileSelected(event: any) {
		const file: File = event.target.files[0];
		if (file) {
      // You can implement your own logic to upload the image to your storage or server
      // For now, we'll just set the photoURL to a local object URL for demonstration purposes.
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.photoURL = reader.result as string;
      };
    }
		// You can perform further operations with the selected file, such as uploading it to a server or displaying a preview.
		// Remember to update your component's property (e.g., createEvent.coverImage) with the selected file or file data.
	  }

}

