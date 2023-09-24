import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GalleryModalComponent } from 'src/app/gallery-modal/gallery-modal.component';

@Component({
  selector: 'app-my-pictures',
  templateUrl: './my-pictures.page.html',
  styleUrls: ['./my-pictures.page.scss'],
})
export class MyPicturesPage implements OnInit {
  currentItem: any;

  constructor( 
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  images: any[] = [
    { url: '../assets/images/image1.jpg' },
    { url: '../assets/images/image2.jpg' },
    { url: '../assets/images/image3.jpg' },
    { url: '../assets/images/image4.jpg' },
    { url: '../assets/images/image5.jpg' },
    // Add more image objects here
  ];

  viewImage(image: any) {
    // Handle image viewing logic here
    console.log('Viewing image:', image.url);
  }

  async openImageModal(image: any, index: number) {
    console.log('clicked', index)
    this.currentItem = image;
    const modal = await this.modalController.create({
      component: GalleryModalComponent,
      componentProps: {
        images: this.images,
        initialIndex: index
      }
    });

    return await modal.present();
  }

  

}
