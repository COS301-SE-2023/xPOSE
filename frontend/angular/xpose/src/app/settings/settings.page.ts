// settings.page.ts
import { Component, OnInit } from "@angular/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit {
  selectedImage: string | null = null;

  constructor(private http: HttpClient) {}

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
}
