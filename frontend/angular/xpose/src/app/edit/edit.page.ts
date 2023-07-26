import { AfterViewInit,Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../shared/services/auth.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, AfterViewInit {
  editForm: FormGroup;
  photoURL: string;
  username: string;
  email: string;
  isPublic: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.photoURL = './assets/images/profile picture.jpg';
    this.email = 'johndoe@example.com';
    this.username = 'John Doe';

    // Initialize the form with default values
    this.editForm = this.formBuilder.group({
      username: [this.username, Validators.required],
      email: [this.email, [Validators.required, Validators.email]],
      isPublic: [this.isPublic]
    });
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {}

  saveProfile() {
    if (this.editForm.valid) {
      // Get the updated values from the form
      const updatedProfile = this.editForm.value;
      console.log('Updated Profile:', updatedProfile);
      console.log('Account Privacy:', this.isPublic ? 'Public' : 'Private');

      // Call a service method to update the profile
      // Your service logic goes here

      // Navigate back to the profile page after saving
      this.router.navigate(['/profile']);
    }
    else{
      console.log("Invalid form submission");
      return;
    }
  }

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

  deleteAccount() {
    // Add your logic here to delete the user account.
    // You may want to show a confirmation modal to confirm the deletion before proceeding.
    console.log('Account deleted');
  }

  onButtonClick(){
    this.router.navigateByUrl('/profile');
  }
}
