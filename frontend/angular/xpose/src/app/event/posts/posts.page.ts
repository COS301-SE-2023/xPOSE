import { Component } from '@angular/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage {
  uploadedImages: any[] = [];
  imageRows: any[][] = [];

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const image = { url: reader.result };
          this.uploadedImages.push(image);
          if (this.uploadedImages.length % 2 === 0) {
            this.imageRows.push([this.uploadedImages[this.uploadedImages.length - 2], image]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }
}
