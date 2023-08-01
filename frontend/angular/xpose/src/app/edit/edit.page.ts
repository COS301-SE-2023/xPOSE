import { AfterViewInit,Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../shared/services/auth.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, AfterViewInit {
 public history: string[] = [];
  editForm: FormGroup;
  photoURL: string;
  username: string;
  email: string;
  isPublic: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private location: Location
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

    console.log('Username:', this.username);
    console.log('Account Privacy:', this.isPublic);
    
  }
  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // we can implement your own logic to upload the image to your storage or server
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.photoURL = reader.result as string;
      };
    }
  }

  deleteAccount() {
    // Add your logic here to delete the user account.
    // You may want to show a confirmation modal to confirm the deletion before proceeding.
    console.log('Account deleted');
  }

  goBack(){
		this.location.back();
	}

}
