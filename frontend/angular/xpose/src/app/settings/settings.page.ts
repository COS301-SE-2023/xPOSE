import { Component, OnInit } from "@angular/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../shared/services/auth.service";
import { ApiService } from "../service/api.service";
import { Observable, map } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";


@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit {
  selectedImage: string | null = null;
  username: string = 'JohnDoe';
  fullName: string = 'John Doe';
  email: string = 'john.doe@example.com';
  privacy: string = 'public';

  constructor(private http: HttpClient, 
    public authService: AuthService,
		private router: Router,
		private api: ApiService,
		private afAuth: AngularFireAuth) {}


	headshot_image_url: string = '';
  
	ngOnInit() {
		this.getCurrentUserId().subscribe((uid) => {
			// formData.append('user_id', uid);
		  
			  if (uid) {
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
  updatePrivacy() {
    // Implement logic to send updated privacy setting to the server
    // You may use Angular's HttpClient for making API requests
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
registerFacialData() {
	// Create FormData and append the image Blob to it
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
    // Implement logic to register facial data on the server
    // You may use Angular's HttpClient for making API requests
  }

  // Method to delete facial recognition data
  deleteFacialData() {
    // Implement logic to delete facial data on the server
    // You may use Angular's HttpClient for making API requests
  }

	// Method to delete the user's account
	deleteAccount() {
		// Implement logic to delete the user's account on the server
		// You may use Angular's HttpClient for making API requests
	}

	// Method to update user profile
	updateProfile() {
		// Implement logic to send updated profile data to the server
		// You may use Angular's HttpClient for making API requests
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
