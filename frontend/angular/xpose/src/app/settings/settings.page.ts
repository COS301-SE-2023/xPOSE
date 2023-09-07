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

  constructor(private http: HttpClient, 
    public authService: AuthService,
		private router: Router,
		private api: ApiService,
		private afAuth: AngularFireAuth) {}

  ngOnInit() {}

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

  authorizeImage() {
    // Implement logic to authorize images (if needed)
  }

  register() {
    // Implement logic to register the selected image (if needed)
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
