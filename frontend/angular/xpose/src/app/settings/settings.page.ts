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

  authorizeImage() {
    // Here you can implement the logic to authorize images
    // For now, let's assume images are authorized
  }

  register() {}
}
