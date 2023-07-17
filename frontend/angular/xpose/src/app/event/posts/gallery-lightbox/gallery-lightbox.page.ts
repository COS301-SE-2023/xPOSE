// gallery-lightbox.page.ts
import { Component, Input, OnInit } from '@angular/core';
import { GalleryDataService } from './gallery-data.service';

interface Item {
  imageSrc: string;
  imageAlt: string;
}

@Component({
  selector: 'app-gallery-lightbox',
  templateUrl: './gallery-lightbox.page.html',
  styleUrls: ['./gallery-lightbox.page.scss'],
})
export class GalleryLightboxPage implements OnInit {
  @Input() galleryData: Item[] = [];
  @Input() showCount = false;

  constructor(private galleryDataService: GalleryDataService) {}

  ngOnInit() {
    this.galleryData = this.galleryDataService.getData();
    this.totalImageCount = this.galleryData.length;
  }

  //buttons
  previewImage =  false;
  showMask = false;
  currentLightboxImage: Item = this.galleryData[0];
  currentIndex = 0;
  controls = true;
  totalImageCount = 0;


  onPreviewImage(index: number): void {
    //shows image in lightbox
    this.showMask = true;
    this.previewImage = true;
    this.currentIndex = index;
    this.currentLightboxImage = this.galleryData[index];
    
  }
}
