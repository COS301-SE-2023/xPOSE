import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage {
  constructor(private navCtrl: NavController, private sanitizer: DomSanitizer) {
  }


  // This method will be called when user clicks on any image
  //url; //Angular 8
	url: any; //Angular 11, for stricter type
	msg = "";
	
	//selectFile(event) { //Angular 8
	// selectFile(event: any) { //Angular 11, for stricter type
	// 	if(!event.target.files[0] || event.target.files[0].length == 0) {
	// 		this.msg = 'You must select an image';
	// 		return;
	// 	}
		
	// 	var mimeType = event.target.files[0].type;
		
	// 	if (mimeType.match(/image\/*/) == null) {
	// 		this.msg = "Only images are supported";
	// 		return;
	// 	}
		
	// 	var reader = new FileReader();
	// 	reader.readAsDataURL(event.target.files[0]);
		
	// 	reader.onload = (_event) => {
	// 		this.msg = "";
	// 		this.url = reader.result; 
	// 	}
	// }

  public uploadedImages: File[] = [];
  public imageUrls: SafeUrl[] = [];

  public selectFiles(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.uploadedImages.push(file);
      this.uploadImage(file);
    }
  }
  
  public uploadImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageUrl = e.target.result;
      this.imageUrls.push(this.sanitizer.bypassSecurityTrustUrl(imageUrl));
    };
    reader.readAsDataURL(file);
  }

  


// constructor(private sanitizer: DomSanitizer) {}

public getSafeImageUrl(image: File): SafeUrl {
  return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(image));
}

  
  
  
}
