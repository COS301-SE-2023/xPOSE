import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.component.html',
  styleUrls: ['./gallery-modal.component.scss'],
})
export class GalleryModalComponent  implements OnInit {
  @Input() galleryData: any[] = []; // Input to receive the entire gallery data
  @Input() initialIndex: number = 0; // Input to receive the index of the clicked image

  currentIndex: number;

  constructor(private modalController: ModalController) {
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

  ngOnInit() {}

}
