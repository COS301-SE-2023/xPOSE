import { Component, OnInit } from "@angular/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../shared/services/auth.service";


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
		private router: Router) {}

  ngOnInit() {}

  async uploadImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
    });

    if (image && image.webPath) {
      this.selectedImage = image.webPath;
	  const imageName = Date.now().toString();
	  fetch(`https://gfvj9hjfr6.execute-api.us-east-1.amazonaws.com/dev/xpose-posts/${imageName}.jpeg`, {
		method: 'PUT',
		headers: {
		  'Content-Type': 'image/jpeg'
		},
		body: image.webPath
	  })
	  .then(response => response.json())
    }
  }

  authorizeImage() {
    // Implement logic to authorize images (if needed)
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
    const file = event.target.files[0];
    // Implement logic to upload and register facial data on the server
    // You may use Angular's HttpClient for making API requests
  }
  registerFacialData() {
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
