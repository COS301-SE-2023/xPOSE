// settings.page.ts
import { Component, OnInit } from "@angular/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit {
  selectedImage: string | null = null;

  constructor() {}

  ngOnInit() {}

  async uploadImage() {
    // Here you can implement the logic to handle image upload
    // For now, let's assume you set the selectedImage with a sample URL
    this.selectedImage = "https://example.com/sample-image.jpg";

	const image = await Camera.getPhoto({
		quality: 90,
		allowEditing: true,
		resultType: CameraResultType.Uri,
		source: CameraSource.Prompt, // Allow the user to choose between the gallery and camera
	});

	if(image && image.webPath) {
		// display image
		this.selectedImage = image.webPath;
	}
  }

  async openImageGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt, // Allow the user to choose between the gallery and camera
    });
  
    if (image && image.webPath) {
      try {
        // Convert image to Blob
        const response = await fetch(image.webPath);
        const blobImage = await response.blob();
  
        // Create FormData and append the image Blob to it
        const formData = new FormData();
        formData.append('image', blobImage, 'image.jpg');
  
        // Send the FormData to the server
        // this.getCurrentUserId().subscribe((uid) => {
        //   if (uid) {
        //     this.http.post(`${this.api.apiUrl}/p/${this.current_event.code}?uid=${uid}`, formData).subscribe(
        //       (res: any) => {
        //         console.log(res);
        //       },
        //       (error: any) => {
        //         console.error(error);
        //       }
        //     );
        //   }
        // });
      } catch (error) {
        console.error('Error while processing image:', error);
      }
    } else {
      console.log("No image data available.");
    }

    // this.isGalleryOpen = true;
  }
  

  authorizeImage() {
    // Here you can implement the logic to authorize images
    // For now, let's assume images are authorized
  }
}
