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
      'https://example.com/picture1.jpg',
      'https://example.com/picture2.jpg',
      // Add more picture URLs as needed
    ];
  }
}
