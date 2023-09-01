import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { ApiService } from '../service/api.service';


// import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.component.html',
  styleUrls: ['./gallery-modal.component.scss'],
})
export class GalleryModalComponent  implements OnInit {
  @Input() galleryData: any[] = []; // Input to receive the entire gallery data
  @Input() initialIndex: number = 0; // Input to receive the index of the clicked image

  currentIndex: number;
  previewImage = false;
  showMask = false;
  isLiked: boolean = false;
  likeCount: number = 0;
  // currentLightboxImage: Item = this.galleryData[0];

  constructor(
    private modalController: ModalController,
    private menuController: MenuController,
    private http: HttpClient,
    private api: ApiService,
  ) {
    this.currentIndex = this.initialIndex;
  }

  closeModal() {
    this.modalController.dismiss();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.galleryData.length) % this.galleryData.length;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.galleryData.length;
  }

  toggleLike() {
    this.isLiked = !this.isLiked;

    if (this.isLiked) {
      this.likeCount++;
    } else {
      this.likeCount--;
    }
  }


  ngOnInit() {}
 downloadImage() {
  
  // const fileTransfer: FileTransferObject = this.transfer.create();
  
  // // Get the current image URL
  // const imageUrl = this.galleryData[this.currentIndex].imageSrc;

  // // Generate a unique file name for the downloaded image
  // const fileName = `image_${Date.now()}.jpg`;

  // // Set the download URL and target path
  // const downloadUrl = encodeURI(imageUrl);
  // const targetPath = this.platform.is('ios') ? this.file.documentsDirectory : this.file.externalDataDirectory;
  
  // // Download the image file
  // fileTransfer.download(downloadUrl, targetPath + fileName).then(
  //   entry => {
  //     console.log('Image downloaded successfully: ' + entry.toURL());
  //   },
  //   error => {
  //     console.error('Error downloading image: ' + error);
  //   }
  // );
}

deleteImage() {
  const item = this.galleryData[this.currentIndex];


  // Get the current image ID or reference
  // const imageId = this.galleryData[this.currentIndex].id;
  // console.log(this.galleryData[this.currentIndex]);

  // Use the appropriate method to delete the image
  // For example, if you are using Firebase, you can use the following code:
  // firebase.storage().ref().child(imageId).delete()
    // .then(() => {
    //   console.log('Image deleted successfully');
    // })
    // .catch((error) => {
    //   console.error('Error deleting image:', error);
    // });
    this.http.delete(`${this.api.apiUrl}/p/${item.event_id}/${item.id}`).subscribe((res) => {
      console.log(`${this.api.apiUrl}/p/${item.event_id}/${item.id}`);
      this.onClosePreview();
    });
}
onClosePreview(){
  this.previewImage = false;
  this.showMask = false;
}


shareImage(imageUrl: string) {
  // Assuming imageUrl is the URL of the current image you want to share

  // Check if the Web Share API is available
  if (navigator.share) {
    navigator.share({
      title: 'Check out this image!',
      text: 'I found this image and wanted to share it with you.',
      url: imageUrl,
    })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
  } else {
    // Fallback code for browsers that don't support Web Share API
    // You could open a new window with a sharing URL, or display a sharing dialog
    // specific to your application.
    // For example, using a library like SweetAlert for a custom sharing dialog.
    // You can replace this with your own logic.
    alert('To share this image, copy and paste the URL: ' + imageUrl);
  }
}



  openContextMenu() {
    this.menuController.enable(true, 'imageMenu');
    this.menuController.open('imageMenu');
  }

}
