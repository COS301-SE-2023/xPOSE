import { AfterViewInit,Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../shared/services/auth.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Service } from '../service/service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LoadingController } from "@ionic/angular";


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
  selectedFile: File | null = null;
  currentPhotoURL: string ="";

  loading!: HTMLIonLoadingElement;
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private location: Location,
    private service: Service,
    private storage: AngularFireStorage,
    private loadingController: LoadingController
  ) {

    this.photoURL = '';
    this.email = '';
    this.username = '';
    // Initialize the form with default values
    this.editForm = this.formBuilder.group({
      username: [this.username, Validators.required],
      email: [this.email, [Validators.required, Validators.email]],
      isPublic: [this.isPublic],
      photoURL: [this.photoURL]
    });
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.authService.getCurrentUserId().subscribe((uid) => {
      if (uid) {
        this.service.GetUser(uid).subscribe((userData) => {
          this.photoURL =userData.photoURL; 
          this.isPublic =userData.visibility;        
        });
      }
      else {
        console.log("profile page no user id");
      }
    });
  }

  saveProfile() {
    console.log('Username:', this.username);
    console.log('Account Privacy:', this.isPublic);

  }
  
  onProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoURL = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async saveChanges() {

    try {

      if (!this.selectedFile && !this.username && !this.isPublic) {
        console.log("Every filed is empty")
      }else {
        console.log('Full Name:', this.username);
        console.log('Account Privacy:', this.isPublic);
        const file = this.editForm.value.photoURL;
        // console.log("File",this.selectedFile);
  
        this.authService.getCurrentUserId().subscribe((uid) => {
          if (uid) {
            const filePath =  `profile_pictures/${uid}_${new Date().getTime()}`;
            const task = this.storage.upload(filePath, this.selectedFile);
            
            // console.log("Selected file", this.selectedFile);
            task.snapshotChanges().subscribe(
              async (snapthsot) =>{
                if (snapthsot?.state === 'success'){
                  let photourl = await snapthsot.ref.getDownloadURL();
                  // console.log("Download url", photourl);
                  
                  if(!this.selectedFile) photourl = this.photoURL;
                  const data = {
                    displayName: this.username,
                    photoURL: photourl,
                    visibility: this.isPublic 
                  };
                  const requestBody = JSON.stringify(data);
                  // console.log("Data", requestBody)

                //  const response = await this.service.UpdateUserDetails(requestBody, uid);
                //  console.log("User profile updated successfully");

                 try {
                  this.loading = await this.loadingController.create({
                    message: "Updating profile...",
                  });
                  await this.loading.present();

                  const response = await this.service.UpdateUserDetails(requestBody, uid);
                  console.log("User profile updated successfully");
              
                  this.loading.dismiss();
                  this.location.back();
                  this.router.navigate(["/home"]);
                  } catch (error) {
                  this.loading.dismiss();
                  console.error("Error updating profile", error);
                  }
                }
              },
              (error) => {
                console.error('Error uploading profile picture:', error);
              }
            );
          }
          else {
            console.log("profile page no user id");
          }
        });
      }
    }catch(error) {
      console.error('Error saving changes:', error);
    }
  }

  deleteAccount() {
    console.log('Account deleted');
  }

  goBack(){
		this.location.back();
	}

}
