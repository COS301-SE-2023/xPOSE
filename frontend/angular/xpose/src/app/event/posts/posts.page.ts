// posts.page.ts
import { Component } from '@angular/core';
import { GalleryDataService } from './gallery-lightbox/gallery-data.service';

interface Item {
  imageSrc: string;
  imageAlt: string;
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage {
  data: Item[] = [
    { imageSrc: '../assets/images/download.jpg', imageAlt: '1' },
    { imageSrc: '../assets/images/youth.jpg', imageAlt: '2' },
    { imageSrc: '../assets/images/images.jpg', imageAlt: '3' },
    { imageSrc: '../assets/images/qrcode.png', imageAlt: '4' },
    { imageSrc: '../assets/images/image1.webp', imageAlt: '5' },
    { imageSrc: '../assets/images/image2.webp', imageAlt: '6' },{ imageSrc: '../assets/images/download.jpg', imageAlt: '1' },
    { imageSrc: '../assets/images/youth.jpg', imageAlt: '7' },
    { imageSrc: '../assets/images/images.jpg', imageAlt: '8' },
    { imageSrc: '../assets/images/qrcode.png', imageAlt: '9' },
    { imageSrc: '../assets/images/image1.webp', imageAlt: '10' },
    { imageSrc: '../assets/images/image2.webp', imageAlt: '11' },
    
    // Add more items as needed...
  ];

  constructor(private galleryDataService: GalleryDataService) {
    this.galleryDataService.setData(this.data);
  }

  // Other component logic goes here.
}
