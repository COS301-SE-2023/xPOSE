import { Component, OnInit } from "@angular/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../shared/services/auth.service";
import { ApiService } from "../service/api.service";
import { Observable, map } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { LoadingController } from "@ionic/angular";
import { Service } from '../service/service';
import { first } from "rxjs";
import { AngularFireStorage } from "@angular/fire/compat/storage";


@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit {
  selectedImage: string | null = null;
  pictureChanged: boolean = false;
  photoURL: string = "";
  username: string = '...';
  uniqueCode: string = '...';
  email: string = '...';
  privacy: string = 'public';
  uid: string = "";
  loading!: HTMLIonLoadingElement;


  constructor(private http: HttpClient, 
    public authService: AuthService,
		private router: Router,
		private api: ApiService,
		private afAuth: AngularFireAuth,
		private afs: AngularFirestore,
		private loadingController: LoadingController,
		private service: Service,
		private storage: AngularFireStorage,) {
		}

	currentPageName: string = 'Settings';
	headshot_image_url: string = '';
  
	ngOnInit() {
		this.getCurrentUserId().subscribe((uid) => {
			// formData.append('user_id', uid);
		  
			  if (uid) {
				this.uid = uid;
			  this.http.get(`${this.api.apiUrl}/posts/user/${uid}`).subscribe(
				  (res: any) => {
					this.headshot_image_url = res.image_url;
				  console.log(res);
				  },
				  (error: any) => {
					console.log('Hello');
				  console.error(error);
				  }
			  );

			  // current user data
			  this.service.GetUser(uid).subscribe((userData) => {
				this.username = userData.displayName; 
				this.email = userData.email;
				this.privacy = userData.visibility;
				this.uniqueCode = userData.uniq_username;
				this.photoURL =  userData.photoURL;
				// this.isPublic =userData.visibility;       
			  });



			  }
		});
  }

  async uploadImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
    });

	if (image && image.webPath) {
		try {
			this.selectedImage = image.webPath;
		  // Convert image to Blob
		  const response = await fetch(image.webPath);
		  const blobImage = await response.blob();
	
		  // Create FormData and append the image Blob to it
		  const formData = new FormData();
		  formData.append('image', blobImage, 'image.jpg');
		  // Send the FormData to the server
		  this.getCurrentUserId().subscribe((uid) => {
			  formData.append('user_id', uid);
			
				if (uid) {
				this.http.post(`${this.api.apiUrl}/posts/register?uid=${uid}`, formData).subscribe(
					(res: any) => {
					console.log(res);
					},
					(error: any) => {
					console.error(error);
					}
				);
				}
		  });
		} catch (error) {
		  console.error('Error while processing image:', error);
		}
	  } else {
		console.log("No image data available.");
	  }
  }

  async detectFaces() {
    const image = await Camera.getPhoto({
		quality: 90,
		allowEditing: true,
		resultType: CameraResultType.Uri,
		source: CameraSource.Prompt,
	  });
  
	  if (image && image.webPath) {
		  try {
			  this.selectedImage = image.webPath;
			// Convert image to Blob
			const response = await fetch(image.webPath);
			const blobImage = await response.blob();
	  
			// Create FormData and append the image Blob to it
			const formData = new FormData();
			formData.append('image', blobImage, 'image.jpg');
			// Send the FormData to the server
			this.getCurrentUserId().subscribe((uid) => {
				// formData.append('user_id', uid);
			  
				  if (uid) {
				  this.http.post(`${this.api.apiUrl}/posts/detect?uid=${uid}`, formData).subscribe(
					  (res: any) => {
					  console.log(res);
					  },
					  (error: any) => {
					  console.error(error);
					  }
				  );
				  }
			});
		  } catch (error) {
			console.error('Error while processing image:', error);
		  }
		} else {
		  console.log("No image data available.");
		}
  }

  register() {
    // Implement logic to register the selected image (if needed)
  }
  // Method to update account privacy setting
  async updatePrivacy() {
	try {
		this.loading = await this.loadingController.create({
		  message: "Updating privacy...",
		});
		await this.loading.present();

		// Update profile endpoint will go here
		const data = {
			displayName: "",
			photoURL:"",
			visibility: this.privacy
		  };
		const requestBody = JSON.stringify(data);
		const response = await this.service.UpdateUserDetails(requestBody, this.uid);

		await this.loading.dismiss();
	
		// this.router.navigate(["/home"]);
		} catch (error) {
			await this.loading.dismiss();
			console.error("Error updating profile", error);
		}
  }
   // Method to upload facial recognition data
   uploadFacialData(event: any) {
    this.file = event.target.files[0];
	this.headshot_image_url = URL.createObjectURL(this.file);
	// display image

    // Implement logic to upload and register facial data on the server
    // You may use Angular's HttpClient for making API requests
}

file: any | null ;

  // Method to register facial recognition data
async registerFacialData() {
	// Create FormData and append the image Blob to it
	// const temp = 'http://127.0.0.1:5000';

	if(this.file == null) {
		console.log("No image data available.");
		return;
	}

	try {
		this.loading = await this.loadingController.create({
		  message: "registering facial data...",
		});
		
		
		const formData = new FormData();
		formData.append('image', this.file, this.file.name);
		
		await this.loading.present();
		
		const uid = await this.getCurrentUserId().pipe(first()).toPromise();
		if(uid) {
			formData.append('user_id', uid);
			const response = await this.http.post(`${this.api.apiUrl}/posts/register?uid=${uid}`, formData).toPromise();
			await this.loading.dismiss();
			this.self_forceRedirect(); // this can be commented out
		}

	} catch(error) {
		await this.loading.dismiss();
		window.alert("No Face detected");
		console.error("Error registering facial data", error);
	}

	/*======== What is was before ========*/

	/* 
		if(this.file == null) {
		console.log("No image data available.");
		return;
	}
	  const formData = new FormData();
	  formData.append('image', this.file, this.file.name);

	  this.getCurrentUserId().subscribe((uid) => {
		formData.append('user_id', uid);
	  
		  if (uid) {
		  this.http.post(`${this.api.apiUrl}/posts/register?uid=${uid}`, formData).subscribe(
			  (res: any) => {
			  console.log(res);
			  },
			  (error: any) => {
			  console.error(error);
			  }
		  );
		  }
	});
	*/

  }

  // Method to delete facial recognition data
  async deleteFacialData() {
    // Implement logic to delete facial data on the server
    // You may use Angular's HttpClient for making API requests
	try {

		this.loading = await this.loadingController.create({
		  message: "deleting facial data...",
		});

		await this.loading.present();
		const uid = await this.getCurrentUserId().pipe(first()).toPromise();

		if (uid) {
			const response = await this.http.delete(`${this.api.apiUrl}/posts/user/${uid}/delete`).toPromise();
			await this.loading.dismiss();
			this.self_forceRedirect(); // this can be commented out
		}
		
	}
	catch(error){
		console.error("Error deleting facial data", error);
	}

	/*======= What it was ======== */

	/*
	this.getCurrentUserId().subscribe((uid) => {
		  if (uid) {
			console.log(`${this.api.apiUrl}/posts/user/${uid}/delete`);
		  this.http.delete(`${this.api.apiUrl}/posts/user/${uid}/delete`).subscribe(
			  (res: any) => {
			  console.log(res);
			  },
			  (error: any) => {
			  console.error(error);
			  }
		  );
		  }
	});
	 */

  }

	// Method to delete the user's account
	async deleteAccount() {
		try {
			this.loading = await this.loadingController.create({
			  message: "deleting profile...",
			});
			await this.loading.present();

			// Delete user profile endpoint will go here
			const response = await this.service.deleteUser(this.uid);
	
			await this.loading.dismiss();
			localStorage.removeItem('user');
			// force redirect to login page
			this.forceRedirect();
			} catch (error) {
				// await this.loading.dismiss();
				console.error("Error deleting profile", error);
			}
	}

	forceRedirect() {
		const login = `/login`;
		  // Update the window location to trigger a full page refresh
		  window.location.href = login;
	  }

	  self_forceRedirect() {
		const login = `/settings`;
		  // Update the window location to trigger a full page refresh
		  window.location.href = login;
	  }

	// Method to update user profile
	async updateProfile() {

		// upload picture only if link has changed
		const uploadPicture = this.pictureChanged && !!this.selectedImage;
		if(this.username ==="") {
			console.log("Cannot make update if nothing has changed or name is empty");			
			return;
		}

	
		try {
			this.loading = await this.loadingController.create({
			  message: "Updating profile...",
			});
			await this.loading.present();

				// if picture has changed upload it
				var photoURL_ ="";
				try{
					if (uploadPicture) {
						const filePath =  `profile_pictures/${this.uid}_${new Date().getTime()}`;
						console.log("file path", filePath);
						const task = this.storage.upload(filePath, this.selectedImage);
						const snapshot = await task.snapshotChanges().toPromise();
						if (snapshot?.state === 'success') {
							photoURL_ = await snapshot.ref.getDownloadURL();
						}
					}
				} catch(error){
					console.log("Error uploading picture", error);
				}

			// Update profile endpoint will go here
			const data = {
				displayName: this.username,
				photoURL: photoURL_,
				visibility: ""
			  };
			const requestBody = JSON.stringify(data);
			const response = await this.service.UpdateUserDetails(requestBody, this.uid);
	
			await this.loading.dismiss();
			// console.log("DisplayName update successfully")
		
			// this.router.navigate(["/home"]);
			} catch (error) {
				await this.loading.dismiss();
				console.error("Error updating profile", error);
			}
	  }

  getCurrentUserId(): Observable<string> {
    return this.afAuth.authState.pipe(
      map((user) => {
      if (user) {
        return user.uid;
      } else {
        // throw error
        // some extra stuff
        
        console.log('No user is currently logged in.');
        return '';
      }
      })
    );
}

  async uploadAnotherImage() {
    try {
      const objectKey = "your-image-key"; // Replace with actual object key
      const url = `https://example.com/api/images/${objectKey}`;
      const response = await this.http.get(url).toPromise();
      // Process the response as needed
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  onProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Read the selected image file and update the preview
	//   console.log("Picture onProfilePictureChange", file);
	  this.selectedImage = file;
	  this.pictureChanged = true;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoURL = e.target.result;
      };
      reader.readAsDataURL(file);
    }

  }
   // Method to trigger the file input
   selectProfileImage() {
    const fileInput = document.getElementById('profileImage');
    if (fileInput) {
      fileInput.click(); // Simulate a click on the file input
    }
  }
  search() {
		this.router.navigateByUrl('/search');
	}
	
	eventDetails(event_id: string) {
		this.router.navigate(['/view-event', event_id]);
	}

	viewEvent() {
		this.router.navigate(['/event']);
		}
	
		  onEvent(){
			this.router.navigate(['/create-event']);
		}
	
		onNotifications(){
			this.router.navigate(['/notification']);
		}
		
		onProfile(){
			this.router.navigate(['/profile']);
		}  
	
		onJoinedEvent(){
			this.router.navigate(['/joined-event']);
		}
	
		onHome(){
			this.router.navigate(['/home']);
		}
	
		onSettings(){
			this.router.navigate(['/settings']);
		}
		
	   logout() {
		this.authService.signOut();
	  }
}
