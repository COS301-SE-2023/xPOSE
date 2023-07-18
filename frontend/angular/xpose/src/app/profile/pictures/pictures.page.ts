import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.page.html',
  styleUrls: ['./pictures.page.scss'],
})
export class PicturesPage implements OnInit {
  userPictures: string[] | undefined; // Define the userPictures property as an array of strings to hold picture URLs

  constructor() { }

  ngOnInit() {
    // Populate the userPictures array with picture URLs
    this.userPictures = [
      './assets/images/john pic1.jpg',
      './assets/images/John Pic2.jpg',
      './assets/images/John Pic3.jpg',
      './assets/images/John Pic4.jpg',
      


      // Add more'./assets/images/John Pic3.jpg', picture URLs as needed
    ];
  }
}
