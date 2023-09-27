import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GalleryModalComponent } from 'src/app/gallery-modal/gallery-modal.component';
import {  AnimationEvent } from '@angular/animations';
import { ApiService } from 'src/app/service/api.service';
import { HttpClient } from '@angular/common/http';
import { GalleryDataService } from '../event/posts/gallery-lightbox/gallery-data.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';


interface Item {
  imageSrc: string;
  imageAlt: string;
  event_id: string;
  uid: string;
  id: string;
  users_in_image: string[];
}

interface Post {
  event_id: string;
  uid: string;
  id: string;
  timestamp?: Date;
  imageSrc: string;
  users_in_image: string[];
  imageAlt: string;
}


@Component({
  selector: 'app-my-pictures',
  templateUrl: './my-pictures.page.html',
  styleUrls: ['./my-pictures.page.scss'],
})
export class MyPicturesPage implements OnInit {
  @Input() galleryData: Item[] = [];
  @Input() showCount = false;

  constructor(private galleryDataService: GalleryDataService,
    private api: ApiService,
    private http: HttpClient,
    private modalController: ModalController,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
    ) {}

    postsCollection: AngularFirestoreCollection<Post> | undefined;

  ngOnInit() {
    // this.galleryData = this.galleryDataService.getData();



    this.getCurrentUserId().subscribe((uid) => {
      if(uid) {
        this.postsCollection = this.afs.collection(`Users/${uid}/posts`);
        if(this.postsCollection === undefined) {
          console.log('Could not load posts');
          return;
        }
    
        this.postsCollection.snapshotChanges().pipe().subscribe((data) => {
          this.galleryData.length = 0;
    
          data.forEach((doc: any) => {
            const post: any = doc.payload.doc.data();
            console.log(post);
            this.galleryData.push({
              imageSrc: post.image_url,
              imageAlt: post.timestamp,
              event_id: post.event_id,
              uid: post.uid,
              id: doc.payload.doc.id,
              users_in_image: post.users_in_image
            } as Item);
            
          });
    
          console.log('Gallery Data: ')
          console.log(this.galleryData);
        });
      }
      else {
        console.log("no user id");
      }
    });
    this.totalImageCount = this.galleryData.length;


  }

  //buttons
  previewImage =  false;
  showMask = false;
  currentLightboxImage: Item = this.galleryData[0];
  currentIndex = 0;
  controls = true;
  totalImageCount = 0;
  currentItem: any ;
  
  getCurrentUserId(): Observable<string> {
    return this.afAuth.authState.pipe(
      map((user) => {
      if (user) {
        return user.uid;
      } else {
        console.log('No user is currently logged in.');
        return '';
      }
      })
    );
    
    }

  async openImageModal(item: any, index: number) {
    console.log('clicked', index)
    this.currentItem = item;
    const modal = await this.modalController.create({
      component: GalleryModalComponent,
      componentProps: {
        galleryData: this.galleryData,
        initialIndex: index
      }
    });

    return await modal.present();
  }

  onPreviewImage(index: number): void {
    //shows image in lightbox
    this.showMask = true;
    this.previewImage = true;
    this.currentIndex = index;
    this.currentLightboxImage = this.galleryData[index];
    
  }
  onAnimationEnd(event: AnimationEvent){
    if (event.toState === 'void') {
      this.showMask = false;
    }
  }
  onClosePreview(){
    this.previewImage = false;
    this.showMask = false;
  }
  next(): void {
    this.currentIndex = this. currentIndex + 1;
    if(this.currentIndex > this.galleryData.length - 1) {
      this.currentIndex = 0;
    }
    this.currentLightboxImage = this.galleryData[this.currentIndex];
  }
  prev(): void {
    this.currentIndex = this. currentIndex - 1;
    if(this.currentIndex < 0) {
      this.currentIndex = this.galleryData.length - 1;
    }
    this.currentLightboxImage = this.galleryData [this.currentIndex];
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      // You can handle the selected file here, for example, read it as a data URL
      const file = inputElement.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const imageSrc = reader.result as string;
        const imageAlt = file.name; // You can set a default alt text here, or ask the user to provide one.
        // Now you can add the new image to the galleryData array
        // this.galleryData.push({ imageSrc, imageAlt,  });
      };

      reader.readAsDataURL(file);
    }
  }

  downloadImage(item: Item) {
    if (this.previewImage && this.currentLightboxImage) {
      const imageSrc = this.currentLightboxImage.imageSrc;
  
      // Check if the image source is valid
      if (!imageSrc || typeof imageSrc !== 'string') {
        console.error('Invalid image source.');
        return;
      }
  
      const a = document.createElement('a');
      a.href = imageSrc;
  
      // Use the imageAlt as the suggested file name, or 'image' if imageAlt is not available
      a.download = this.currentLightboxImage.imageAlt || 'image';
  
      // Append the anchor element to the DOM to trigger the download
      document.body.appendChild(a);
  
      // Programatically click the anchor element to trigger the download
      a.click();
  
      // Remove the anchor element from the DOM after the click
      document.body.removeChild(a);
    }
  }
  

  shareImage(item: Item) {
    // Replace this with the actual share functionality code
    // For example, you can use a social media sharing library to implement the share feature
    console.log(item);
    // alert('Share functionality to be implemented.');
  }

  // Delete button functionality
  deleteImage(item: Item) {
    // Replace this with the actual delete functionality code
    // For example, you can remove the image from the galleryData array or make an API call to delete the image
    // console.log(item);
    // alert('Delete functionality to be implemented.');
    this.http.delete(`${this.api.apiUrl}/p/${item.event_id}/${item.id}`).subscribe((res) => {
      console.log(res);
      this.onClosePreview();
    });
  }
}
